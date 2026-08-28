package com.itsmartsystems.bookyourseat.service;

import com.itsmartsystems.bookyourseat.Status;
import com.itsmartsystems.bookyourseat.model.PostgresUser;
import com.itsmartsystems.bookyourseat.model.Reservation;
import com.itsmartsystems.bookyourseat.model.Room;
import com.itsmartsystems.bookyourseat.model.Seat;
import com.itsmartsystems.bookyourseat.repository.PostgresUserRepository;
import com.itsmartsystems.bookyourseat.repository.ReservationRepository;
import com.itsmartsystems.bookyourseat.repository.RoomRepository;
import com.itsmartsystems.bookyourseat.repository.SeatRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private SeatRepository seatRepository;

    @Mock
    private PostgresUserRepository postgresUserRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private N8nService n8nService;

    @InjectMocks
    private ReservationService reservationService;

    @Test
    void createReservation_doesNotCreateAutomaticNotificationsWhenOnlyOneDistinctUserHasReservations() {
        PostgresUser user = user(1, 10, "ana@example.com");
        PostgresUser colleague = user(2, 10, "bogdan@example.com");
        Room room = room(100L, "A1", "OFFICE_ROOM");
        Seat seat = seat(200L, room, "A1-01");
        LocalDateTime start = LocalDateTime.of(2026, 8, 25, 9, 0);
        LocalDateTime end = LocalDateTime.of(2026, 8, 25, 17, 0);

        Reservation existingReservation = reservation(user, seat, null, start.plusHours(1), end, Status.APPROVED);

        when(roomRepository.findByCode("A1")).thenReturn(Optional.of(room));
        when(seatRepository.findByCodeForUpdate("A1-01")).thenReturn(Optional.of(seat));
        when(reservationRepository.findBySeat_IdAndStatusInAndStartDateTimeLessThanAndEndDateTimeGreaterThan(
                eq(200L), any(), eq(end), eq(start))).thenReturn(List.of());
        when(reservationRepository.save(any(Reservation.class))).thenAnswer(invocation -> {
            Reservation saved = invocation.getArgument(0);
            saved.setId(300L);
            return saved;
        });
        when(reservationRepository.findByUserDepartmentIdAndStartDateTimeBetween(eq(10), any(), any()))
                .thenReturn(List.of(existingReservation, reservation(user, seat, null, start, end, Status.APPROVED)));

        reservationService.createReservation(user, "A1", "A1-01", start, end, 0);

        verify(postgresUserRepository, never()).findByDepartmentId(10);
        verify(notificationService, never()).createColleaguesComingNotification(any(), any(), any());
    }

    @Test
    void createReservation_doesNotCreateAutomaticNotificationsForEventRooms() {
        PostgresUser user = user(1, 10, "ana@example.com");
        Room room = room(100L, "E1", "EVENT_ROOM");
        LocalDateTime start = LocalDateTime.of(2026, 8, 25, 9, 0);
        LocalDateTime end = LocalDateTime.of(2026, 8, 25, 17, 0);

        when(roomRepository.findByCode("E1")).thenReturn(Optional.of(room));
        when(reservationRepository.findByRoom_IdAndStatusIn(eq(100L), any()))
                .thenReturn(List.of());
        when(seatRepository.findByRoomId(100L)).thenReturn(List.of());
        when(reservationRepository.save(any(Reservation.class))).thenAnswer(invocation -> {
            Reservation saved = invocation.getArgument(0);
            saved.setId(300L);
            return saved;
        });

        reservationService.createReservation(user, "E1", null, start, end, 0);

        verify(reservationRepository, never()).findByUserDepartmentIdAndStartDateTimeBetween(any(), any(), any());
        verify(notificationService, never()).createColleaguesComingNotification(any(), any(), any());
    }

    private static PostgresUser user(Integer id, Integer departmentId, String email) {
        PostgresUser user = new PostgresUser();
        user.setId(id);
        user.setDepartmentId(departmentId);
        user.setEmail(email);
        user.setName(email);
        return user;
    }

    private static Room room(Long id, String code, String type) {
        Room room = new Room();
        room.setId(id);
        room.setCode(code);
        room.setName(code);
        room.setType(type);
        room.setCapacity(10L);
        return room;
    }

    private static Seat seat(Long id, Room room, String code) {
        Seat seat = new Seat();
        seat.setId(id);
        seat.setRoom(room);
        seat.setCode(code);
        seat.setStatus("AVAILABLE");
        seat.setType("DESK");
        return seat;
    }

    private static Reservation reservation(PostgresUser user, Seat seat, Room room,
            LocalDateTime start, LocalDateTime end, Status status) {
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setSeat(seat);
        reservation.setRoom(room);
        reservation.setStartDateTime(start);
        reservation.setEndDateTime(end);
        reservation.setStatus(status);
        reservation.setRecurrence(0);
        return reservation;
    }
}