package com.itsmartsystems.bookyourseat.service;

import com.itsmartsystems.bookyourseat.model.PostgresUser;
import com.itsmartsystems.bookyourseat.model.Reservation;
import com.itsmartsystems.bookyourseat.model.Room;
import com.itsmartsystems.bookyourseat.model.Seat;
import com.itsmartsystems.bookyourseat.repository.ReservationRepository;
import com.itsmartsystems.bookyourseat.repository.RoomRepository;
import com.itsmartsystems.bookyourseat.repository.SeatRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final SeatRepository seatRepository;

    public ReservationService(ReservationRepository reservationRepository, RoomRepository roomRepository, SeatRepository seatRepository) {
        this.reservationRepository = reservationRepository;
        this.roomRepository = roomRepository;
        this.seatRepository = seatRepository;
    }

    public Reservation createReservation(PostgresUser user, String roomCode, String seatCode, LocalDateTime start, LocalDateTime end, Integer recurrence) {
        Room room = roomRepository.findByCode(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("This room does not exist!"));

        Seat seat = null;
        if (seatCode != null && !seatCode.isBlank()) {
            seat = seatRepository.findByCode(seatCode)
                    .orElseThrow(() -> new IllegalArgumentException("This seat does not exist!"));

            if (!seat.getRoom().getId().equals(room.getId())) {
                throw new IllegalArgumentException("This seat does not belong to this room!");
            }
        }

        boolean isWholeRoomReservation = requiresApproval(room);
        Seat reservedSeat = isWholeRoomReservation ? null : seat;

        List<Reservation> reservations = reservedSeat == null
                ? reservationRepository.findByRoom_IdAndStatus(room.getId(), "APPROVED")
                : reservationRepository.findBySeat_IdAndStatusInAndStartDateTimeLessThanAndEndDateTimeGreaterThan(
                        reservedSeat.getId(),
                        List.of("APPROVED", "PENDING"),
                        end,
                        start
                );

        validateNoOverlap(reservations, null, start, end);

        int recurrenceValue = recurrence == null ? 0 : recurrence;
        boolean isDirectSeatReservation = reservedSeat != null && recurrenceValue == 0;

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setRoom(reservedSeat == null ? room : null);
        reservation.setSeat(reservedSeat);
        reservation.setStartDateTime(start);
        reservation.setEndDateTime(end);
        reservation.setStatus(isDirectSeatReservation ? "APPROVED" : "PENDING");
        reservation.setRecurrence(recurrenceValue);

        if (isDirectSeatReservation) {
            reservedSeat.setStatus("OCCUPIED");
            seatRepository.save(reservedSeat);
        } else if (isWholeRoomReservation) {
            List<Seat> roomSeats = seatRepository.findByRoomId(room.getId());
            roomSeats.forEach(roomSeat -> roomSeat.setStatus("PENDING"));
            seatRepository.saveAll(roomSeats);
        }

        return reservationRepository.save(reservation);
    }

    public void deleteReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation does not exist!"));

        reservationRepository.delete(reservation);
    }

    public Reservation modifyReservation(PostgresUser user, Long reservationId, String roomCode, String seatCode, LocalDateTime start, LocalDateTime end, Integer recurrence) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation does not exist!"));

        Room room = roomRepository.findByCode(roomCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid room!"));

        Seat seat = null;
        if (seatCode != null && !seatCode.isBlank()) {
            seat = seatRepository.findByCode(seatCode)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid seat!"));

            if (!seat.getRoom().getId().equals(room.getId())) {
                throw new IllegalArgumentException("This seat does not belong to this room!");
            }
        }

        List<Reservation> reservations = seat == null
                ? reservationRepository.findByRoom_IdAndStatus(room.getId(), "APPROVED")
                : reservationRepository.findBySeat_IdAndStatusInAndStartDateTimeLessThanAndEndDateTimeGreaterThan(
                        seat.getId(),
                        List.of("APPROVED", "PENDING"),
                        end,
                        start
                );

        validateNoOverlap(reservations, reservationId, start, end);

        reservation.setUser(user);
        reservation.setRoom(seat == null ? room : null);
        reservation.setSeat(seat);
        reservation.setStartDateTime(start);
        reservation.setEndDateTime(end);
        reservation.setStatus("PENDING");
        reservation.setRecurrence(recurrence == null ? 0 : recurrence);

        return reservationRepository.save(reservation);
    }

    public Reservation approveReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation does not exist!"));

        if (!"PENDING".equals(reservation.getStatus())) {
            throw new IllegalArgumentException("Only pending reservations can be approved!");
        }

        reservation.setStatus("APPROVED");
        updateReservedSeatsStatus(reservation, "OCCUPIED");
        return reservationRepository.save(reservation);
    }

    public Reservation rejectReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation does not exist!"));

        if (!"PENDING".equals(reservation.getStatus())) {
            throw new IllegalArgumentException("Only pending reservations can be rejected!");
        }

        reservation.setStatus("REJECTED");
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

        if (!("PENDING".equals(reservation.getStatus()) || "APPROVED".equals(reservation.getStatus()))) {
            throw new IllegalArgumentException("Only pending or approved reservations can be cancelled!");
        }

        reservation.setStatus("REJECTED");
        updateReservedSeatsStatus(reservation, "AVAILABLE");
        return reservationRepository.save(reservation);
    }

    public List<Reservation> historyReservation(Integer userId) {
        return reservationRepository.findByUser_Id(userId);
    }

    public List<Reservation> approvedReservations() {
        return reservationRepository.findByStatus("APPROVED");
    }

    public List<Reservation> pendingReservations() {
        return reservationRepository.findByStatus("PENDING");
    }

    public List<Reservation> rejectedReservations() {
        return reservationRepository.findByStatus("REJECTED");
    }

    public List<Reservation> activeReservations(LocalDateTime start, LocalDateTime end) {
        return reservationRepository.findByStatusInAndStartDateTimeLessThanAndEndDateTimeGreaterThan(
                List.of("APPROVED", "PENDING"),
                end,
                start
        );
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







