package com.itsmartsystems.bookyourseat.service;

import com.itsmartsystems.bookyourseat.Status;
import com.itsmartsystems.bookyourseat.dto.BookingHistoryItem;
import com.itsmartsystems.bookyourseat.dto.BookingStats;
import com.itsmartsystems.bookyourseat.dto.BookingSummaryResponse;
import com.itsmartsystems.bookyourseat.model.Notification;
import com.itsmartsystems.bookyourseat.model.PostgresUser;
import com.itsmartsystems.bookyourseat.model.Reservation;
import com.itsmartsystems.bookyourseat.model.Room;
import com.itsmartsystems.bookyourseat.model.Seat;
import com.itsmartsystems.bookyourseat.repository.PostgresUserRepository;
import com.itsmartsystems.bookyourseat.repository.ReservationRepository;
import com.itsmartsystems.bookyourseat.repository.RoomRepository;
import com.itsmartsystems.bookyourseat.repository.SeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Service
public class ReservationService {

    private static final Set<Status> BLOCKING_STATUSES = Set.of(Status.APPROVED, Status.ACCEPTED, Status.PENDING);

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final SeatRepository seatRepository;
    private final PostgresUserRepository postgresUserRepository;
    private final NotificationService notificationService;

    public ReservationService(ReservationRepository reservationRepository, RoomRepository roomRepository,
            SeatRepository seatRepository, PostgresUserRepository postgresUserRepository,
            NotificationService notificationService) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
        this.seatRepository = seatRepository;
        this.postgresUserRepository = postgresUserRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Reservation createReservation(PostgresUser user, String roomCode, String seatCode, LocalDateTime start, LocalDateTime end, Integer recurrence) {
        Room room = roomRepository.findByCode(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("This room does not exist!"));

        Seat seat = null;
        if (seatCode != null && !seatCode.isBlank()) {
            seat = seatRepository.findByCodeForUpdate(seatCode)
                    .orElseThrow(() -> new IllegalArgumentException("This seat does not exist!"));

            if (!seat.getRoom().getId().equals(room.getId())) {
                throw new IllegalArgumentException("This seat does not belong to this room!");
            }
        }

        int recurrenceValue = recurrence == null ? 0 : recurrence;
        if (recurrenceValue < 0) {
            throw new IllegalArgumentException("Recurrence must not be negative!");
        }

        if (recurrenceValue > 0) {
            return createRecurringReservations(user, room, seat, start, end, recurrenceValue);
        }

        boolean isWholeRoomReservation = requiresApproval(room);
        Seat reservedSeat = isWholeRoomReservation ? null : seat;

        List<Reservation> reservations = reservedSeat == null
                ? reservationRepository.findByRoom_IdAndStatusIn(room.getId(), BLOCKING_STATUSES)
                : reservationRepository.findBySeat_IdAndStatusInAndStartDateTimeLessThanAndEndDateTimeGreaterThan(
                        reservedSeat.getId(),
                        BLOCKING_STATUSES,
                        end,
                        start
                );

        validateNoOverlap(reservations, null, start, end);

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setSeat(reservedSeat);
        reservation.setRoom(reservedSeat == null ? room : null);
        reservation.setStartDateTime(start);
        reservation.setEndDateTime(end);
        reservation.setStatus(reservedSeat != null ? Status.APPROVED : Status.PENDING);
        reservation.setRecurrence(0);

        if (reservedSeat != null) {
            reservedSeat.setStatus("OCCUPIED");
            seatRepository.save(reservedSeat);
        } else {
            List<Seat> roomSeats = seatRepository.findByRoomId(room.getId());
            roomSeats.forEach(roomSeat -> roomSeat.setStatus("PENDING"));
            seatRepository.saveAll(roomSeats);
        }

        Reservation savedReservation = reservationRepository.save(reservation);
        createAutomaticColleagueNotifications(savedReservation);
        return savedReservation;
    }

    private Reservation createRecurringReservations(PostgresUser user, Room room, Seat seat,
            LocalDateTime start, LocalDateTime end, int recurrenceWeeks) {
        boolean isWholeRoomReservation = requiresApproval(room);
        Seat reservedSeat = isWholeRoomReservation ? null : seat;
        List<Reservation> savedReservations = new ArrayList<>();

        for (int week = 0; week <= recurrenceWeeks; week++) {
            LocalDateTime occurrenceStart = start.plusWeeks(week);
            LocalDateTime occurrenceEnd = end.plusWeeks(week);

            List<Reservation> overlappingReservations = reservedSeat == null
                    ? reservationRepository.findByRoom_IdAndStatusIn(room.getId(), BLOCKING_STATUSES)
                    : reservationRepository.findBySeat_IdAndStatusInAndStartDateTimeLessThanAndEndDateTimeGreaterThan(
                            reservedSeat.getId(),
                            BLOCKING_STATUSES,
                            occurrenceEnd,
                            occurrenceStart
                    );

            validateNoOverlap(overlappingReservations, null, occurrenceStart, occurrenceEnd);

            Reservation occurrence = new Reservation();
            occurrence.setUser(user);
            occurrence.setSeat(reservedSeat);
            occurrence.setRoom(reservedSeat == null ? room : null);
            occurrence.setStartDateTime(occurrenceStart);
            occurrence.setEndDateTime(occurrenceEnd);
            occurrence.setStatus(Status.PENDING);
            occurrence.setRecurrence(recurrenceWeeks);

            savedReservations.add(reservationRepository.save(occurrence));
        }

        if (reservedSeat != null) {
            reservedSeat.setStatus("PENDING");
            seatRepository.save(reservedSeat);
        } else {
            List<Seat> roomSeats = seatRepository.findByRoomId(room.getId());
            roomSeats.forEach(roomSeat -> roomSeat.setStatus("PENDING"));
            seatRepository.saveAll(roomSeats);
        }

        savedReservations.forEach(this::createAutomaticColleagueNotifications);
        return savedReservations.get(0);
    }
    public void deleteReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation does not exist!"));

        reservationRepository.delete(reservation);
    }

    @Transactional
    public Reservation modifyReservation(PostgresUser user, Long reservationId, String roomCode, String seatCode, LocalDateTime start, LocalDateTime end, Integer recurrence) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation does not exist!"));

        if (reservation.getUser() == null || !reservation.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can only modify your own reservations!");
        }

        if (reservation.getStatus() != Status.PENDING) {
            throw new IllegalArgumentException("Only pending reservations can be modified!");
        }

        Room room = roomRepository.findByCode(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid room!"));

        Seat seat = null;
        if (seatCode != null && !seatCode.isBlank()) {
            seat = seatRepository.findByCodeForUpdate(seatCode)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid seat!"));

            if (!seat.getRoom().getId().equals(room.getId())) {
                throw new IllegalArgumentException("This seat does not belong to this room!");
            }
        }

        boolean wholeRoomReservation = requiresApproval(room);
        Seat reservedSeat = wholeRoomReservation ? null : seat;

        List<Reservation> reservations = reservedSeat == null
                ? new ArrayList<>(reservationRepository.findByRoom_IdAndStatusIn(room.getId(), BLOCKING_STATUSES))
                : reservationRepository.findBySeat_IdAndStatusInAndStartDateTimeLessThanAndEndDateTimeGreaterThan(
                        reservedSeat.getId(),
                        BLOCKING_STATUSES,
                        end,
                        start
                );

        validateNoOverlap(reservations, reservationId, start, end);

        Seat oldSeat = reservation.getSeat();
        Room oldRoom = reservation.getRoom();

        reservation.setSeat(reservedSeat);
        reservation.setRoom(reservedSeat == null ? room : null);
        reservation.setStartDateTime(start);
        reservation.setEndDateTime(end);
        reservation.setStatus(Status.PENDING);
        reservation.setRecurrence(recurrence == null ? 0 : recurrence);

        if (oldSeat != null && (reservedSeat == null || !oldSeat.getId().equals(reservedSeat.getId()))) {
            oldSeat.setStatus("AVAILABLE");
            seatRepository.save(oldSeat);
        }

        if (oldRoom != null && (room.getId() == null || !oldRoom.getId().equals(room.getId()))) {
            List<Seat> oldRoomSeats = seatRepository.findByRoomId(oldRoom.getId());
            oldRoomSeats.forEach(oldRoomSeat -> oldRoomSeat.setStatus("AVAILABLE"));
            seatRepository.saveAll(oldRoomSeats);
        }

        if (reservedSeat != null) {
            reservedSeat.setStatus("PENDING");
            seatRepository.save(reservedSeat);
        } else {
            List<Seat> roomSeats = seatRepository.findByRoomId(room.getId());
            roomSeats.forEach(roomSeat -> roomSeat.setStatus("PENDING"));
            seatRepository.saveAll(roomSeats);
        }

        return reservationRepository.save(reservation);
    }

    public Reservation approveReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation does not exist!"));

        if (reservation.getStatus() != Status.PENDING) {
            throw new IllegalArgumentException("Only pending reservations can be approved!");
        }

        reservation.setStatus(Status.APPROVED);
        updateReservedSeatsStatus(reservation, "OCCUPIED");
        return reservationRepository.save(reservation);
    }

    public Reservation rejectReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation does not exist!"));

        if (reservation.getStatus() != Status.PENDING) {
            throw new IllegalArgumentException("Only pending reservations can be rejected!");
        }

        reservation.setStatus(Status.REJECTED);
        updateReservedSeatsStatus(reservation, "AVAILABLE");
        return reservationRepository.save(reservation);
    }

    public Reservation cancelOwnReservation(Long reservationId, PostgresUser user) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation does not exist!"));

        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can only cancel your own reservations!");
        }

        if (reservation.getEndDateTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Past reservations cannot be cancelled!");
        }

        if (!(reservation.getStatus() == Status.PENDING || reservation.getStatus() == Status.APPROVED)) {
            throw new IllegalArgumentException("Only pending or approved reservations can be cancelled!");
        }

        reservation.setStatus(Status.REJECTED);
        updateReservedSeatsStatus(reservation, "AVAILABLE");
        return reservationRepository.save(reservation);
    }

    public List<Reservation> historyReservation(Integer userId) {
        return reservationRepository.findByUser_Id(userId);
    }

    
    public BookingSummaryResponse getBookingSummary(Integer userId) {
        List<Reservation> reservations = reservationRepository.findByUser_Id(userId);

        BookingStats stats = new BookingStats(
                reservations.stream().filter(reservation -> reservation.getStatus() == Status.APPROVED
                        || reservation.getStatus() == Status.ACCEPTED).count(),
                reservations.stream().filter(reservation -> reservation.getStatus() == Status.PENDING).count(),
                reservations.stream().filter(reservation -> reservation.getStatus() == Status.REJECTED
                        || reservation.getStatus() == Status.DECLINED).count()
        );

        List<BookingHistoryItem> history = reservations.stream()
                .sorted(Comparator.comparing(Reservation::getStartDateTime).reversed())
                .map(this::toBookingHistoryItem)
                .toList();

        return new BookingSummaryResponse(stats, history);
    }

    private BookingHistoryItem toBookingHistoryItem(Reservation reservation) {
        Seat seat = reservation.getSeat();
        Room room = seat != null ? seat.getRoom() : reservation.getRoom();

        return new BookingHistoryItem(
                reservation.getId(),
                reservation.getStartDateTime(),
                seat == null ? "-" : seat.getCode(),
                room == null ? "-" : room.getName(),
                switch (reservation.getStatus()) {
                    case APPROVED, ACCEPTED -> "Confirmat";
                    case PENDING -> "In asteptare";
                    case REJECTED, DECLINED -> "Anulat";
                }
        );
    }

    public List<Reservation> approvedReservations() {
        return reservationRepository.findByStatus(Status.APPROVED);
    }

    public List<Reservation> pendingReservations() {
        return reservationRepository.findByStatus(Status.PENDING);
    }

    public List<Reservation> rejectedReservations() {
        return reservationRepository.findByStatus(Status.REJECTED);
    }

    public List<Reservation> activeReservations(LocalDateTime start, LocalDateTime end) {
        return reservationRepository.findByStatusInAndStartDateTimeLessThanAndEndDateTimeGreaterThan(
                BLOCKING_STATUSES,
                end,
                start
        );
    }

    private void createAutomaticColleagueNotifications(Reservation savedReservation) {
        PostgresUser currentUser = savedReservation.getUser();
        if (currentUser == null || currentUser.getDepartmentId() == null) {
            return;
        }

        LocalDateTime startOfDay = savedReservation.getStartDateTime().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = savedReservation.getStartDateTime().toLocalDate().atTime(LocalTime.MAX);

        List<Reservation> departmentReservations = reservationRepository.findByUserDepartmentIdAndStartDateTimeBetween(
                currentUser.getDepartmentId(), startOfDay, endOfDay);

        long activeDepartmentReservations = departmentReservations.stream()
                .filter(reservation -> BLOCKING_STATUSES.contains(reservation.getStatus()))
                .count();

        if (activeDepartmentReservations < 2) {
            return;
        }

        for (PostgresUser colleague : postgresUserRepository.findByDepartmentId(currentUser.getDepartmentId())) {
            if (colleague.getId().equals(currentUser.getId())) {
                continue;
            }

            boolean hasReservation = reservationRepository.existsByUserAndStartDateTimeBetween(colleague, startOfDay, endOfDay);
            if (hasReservation || notificationService.notificationExistsForUserAndReservation(colleague.getId(), savedReservation.getId())) {
                continue;
            }

            String message = "Your colleagues are coming to the office on " + savedReservation.getStartDateTime().toLocalDate();
            Notification notification = notificationService.createColleaguesComingNotification(colleague, savedReservation, message);
            System.out.println("Created colleagues-coming notification id=" + notification.getId() + " for user=" + colleague.getEmail());
        }
    }

    private void updateReservedSeatsStatus(Reservation reservation, String status) {
        if (reservation.getSeat() != null) {
            Seat seat = reservation.getSeat();
            seat.setStatus(status);
            seatRepository.save(seat);
            return;
        }

        if (reservation.getRoom() != null) {
            List<Seat> roomSeats = seatRepository.findByRoomId(reservation.getRoom().getId());
            roomSeats.forEach(roomSeat -> roomSeat.setStatus(status));
            seatRepository.saveAll(roomSeats);
        }
    }

    private boolean requiresApproval(Room room) {
        String roomCode = room.getCode();
        String roomType = room.getType();

        return "S0".equals(roomCode)
                || "E1".equals(roomCode)
                || "S1".equals(roomCode)
                || "404".equals(roomCode)
                || "O2".equals(roomCode)
                || "MEETING_ROOM".equals(roomType)
                || "EVENT_ROOM".equals(roomType);
    }

    private void validateNoOverlap(List<Reservation> reservations, Long currentReservationId, LocalDateTime start, LocalDateTime end) {
        for (Reservation reservation : reservations) {
            if (currentReservationId != null && reservation.getId().equals(currentReservationId)) {
                continue;
            }

            if (start.isBefore(reservation.getEndDateTime()) && end.isAfter(reservation.getStartDateTime())) {
                throw new IllegalArgumentException("This reservation overlaps with an approved reservation!");
            }
        }
    }
}


