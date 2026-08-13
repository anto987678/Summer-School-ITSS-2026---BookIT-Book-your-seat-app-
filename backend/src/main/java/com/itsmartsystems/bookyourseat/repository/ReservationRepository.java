package com.itsmartsystems.bookyourseat.repository;

import com.itsmartsystems.bookyourseat.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserId(Long userId);

    default List<Reservation> findByIdUtilizator(Long userId) {
        return findByUserId(userId);
    }

    List<Reservation> findBySeatId(Long seatId);

    default List<Reservation> findByIdLoc(Long seatId) {
        return findBySeatId(seatId);
    }

    List<Reservation> findByRoomId(Long roomId);

    default List<Reservation> findByIdSala(Long roomId) {
        return findByRoomId(roomId);
    }

    List<Reservation> findByStatus(String status);

    default List<Reservation> findByStare(Reservation.Stare stare) {
        return findByStatus(stare.name());
    }

    default List<Reservation> findByTipRezervare(Reservation.TipRezervare tipRezervare) {
        return findByStatus(tipRezervare.name());
    }

    List<Reservation> findByUserIdAndStatus(Long userId, String status);

    default List<Reservation> findByIdUtilizatorAndStare(Long userId, Reservation.Stare stare) {
        return findByUserIdAndStatus(userId, stare.name());
    }

    List<Reservation> findBySeatIdAndStatus(Long seatId, String status);

    default List<Reservation> findByIdLocAndStare(Long seatId, Reservation.Stare stare) {
        return findBySeatIdAndStatus(seatId, stare.name());
    }

    List<Reservation> findByRoomIdAndStatus(Long roomId, String status);

    default List<Reservation> findByIdSalaAndStare(Long roomId, Reservation.Stare stare) {
        return findByRoomIdAndStatus(roomId, stare.name());
    }

    default List<Reservation> findByIdSerie(String idSerie) {
        return List.of();
    }

    List<Reservation> findByStartDateTimeBetween(LocalDateTime start, LocalDateTime end);

    default List<Reservation> findByOraInceputBetween(LocalDateTime start, LocalDateTime end) {
        return findByStartDateTimeBetween(start, end);
    }

    List<Reservation> findByEndDateTimeBetween(LocalDateTime start, LocalDateTime end);

    default List<Reservation> findByOraSfarsitBetween(LocalDateTime start, LocalDateTime end) {
        return findByEndDateTimeBetween(start, end);
    }

    List<Reservation> findBySeatIdAndStartDateTimeLessThanAndEndDateTimeGreaterThan(
            Long seatId,
            LocalDateTime endDateTime,
            LocalDateTime startDateTime
    );
}