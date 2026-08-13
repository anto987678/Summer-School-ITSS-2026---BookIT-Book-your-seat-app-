package com.itsmartsystems.bookyourseat.repository;

import com.itsmartsystems.bookyourseat.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserId(Long userId);

    List<Reservation> findByUser_Id(Integer userId);

    List<Reservation> findBySeatId(Long seatId);

    List<Reservation> findByRoomId(Long roomId);

    List<Reservation> findByStatus(String status);

    List<Reservation> findByUserIdAndStatus(Long userId, String status);

    List<Reservation> findBySeatIdAndStatus(Long seatId, String status);

    List<Reservation> findBySeat_IdAndStatus(Long seatId, String status);

    List<Reservation> findByRoomIdAndStatus(Long roomId, String status);

    List<Reservation> findByRoom_IdAndStatus(Long roomId, String status);

    List<Reservation> findByStartDateTimeBetween(LocalDateTime start, LocalDateTime end);

    List<Reservation> findByEndDateTimeBetween(LocalDateTime start, LocalDateTime end);

    List<Reservation> findByStatusInAndStartDateTimeLessThanAndEndDateTimeGreaterThan(
            List<String> statuses,
            LocalDateTime endDateTime,
            LocalDateTime startDateTime
    );

    List<Reservation> findBySeatIdAndStartDateTimeLessThanAndEndDateTimeGreaterThan(
            Long seatId,
            LocalDateTime endDateTime,
            LocalDateTime startDateTime
    );
}

