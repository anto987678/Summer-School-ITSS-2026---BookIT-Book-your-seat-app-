package com.itsmartsystems.bookyourseat.repository;

import com.itsmartsystems.bookyourseat.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    Optional<Seat> findByCode(String code);

    default Seat findByCod(String code) {
        return findByCode(code).orElse(null);
    }

    default Optional<Seat> findById(String id) {
        return findById(Long.valueOf(id));
    }

    List<Seat> findByRoomId(Long roomId);

    default List<Seat> findBySalaId(String roomId) {
        return findByRoomId(Long.valueOf(roomId));
    }

    List<Seat> findByStatus(String status);

    List<Seat> findByType(String type);

    List<Seat> findByRoomIdAndStatus(Long roomId, String status);

    boolean existsByCodeAndRoomId(String code, Long roomId);
}