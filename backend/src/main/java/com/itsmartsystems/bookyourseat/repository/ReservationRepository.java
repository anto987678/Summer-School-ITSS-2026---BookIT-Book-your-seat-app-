package com.itsmartsystems.bookyourseat.repository;

import com.itsmartsystems.bookyourseat.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUser_Id(Integer userId);

    List<Reservation> findBySeat_Id(Long seatId);

    List<Reservation> findByRoom_Id(Long roomId);

    List<Reservation> findByStatus(String status);

    List<Reservation> findByUser_IdAndStatus(Integer userId, String status);

    List<Reservation> findBySeat_IdAndStatus(Long seatId, String status);

    List<Reservation> findByRoom_IdAndStatus(Long roomId, String status);

    List<Reservation> findByStartDateTimeBetween(LocalDateTime start, LocalDateTime end);

    List<Reservation> findByEndDateTimeBetween(LocalDateTime start, LocalDateTime end);

    List<Reservation> findByStatusInAndStartDateTimeLessThanAndEndDateTimeGreaterThan(
            List<String> statuses,
            LocalDateTime endDateTime,
            LocalDateTime startDateTime
    );

    List<Reservation> findBySeat_IdAndStatusInAndStartDateTimeLessThanAndEndDateTimeGreaterThan(
            Long seatId,
            List<String> statuses,
            LocalDateTime endDateTime,
            LocalDateTime startDateTime
    );
}