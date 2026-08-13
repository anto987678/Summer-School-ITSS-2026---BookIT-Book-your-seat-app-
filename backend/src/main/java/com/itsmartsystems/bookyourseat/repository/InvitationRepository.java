package com.itsmartsystems.bookyourseat.repository;

import com.itsmartsystems.bookyourseat.model.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvitationRepository extends JpaRepository<Invitation, Long> {

    List<Invitation> findBySenderId(Long senderId);

    List<Invitation> findByReceiverId(Long receiverId);

    List<Invitation> findBySeatId(Long seatId);

    List<Invitation> findByStatus(String status);

    List<Invitation> findByReceiverIdAndStatus(Long receiverId, String status);

    boolean existsByCreatedReservationId(Long reservationId);
}