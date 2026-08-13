package com.itsmartsystems.bookyourseat.repository;

import com.itsmartsystems.bookyourseat.model.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Long> {

    List<Invitation> findBySenderId_Id(Long senderId);

    List<Invitation> findByReceiverId_Id(Long receiverId);

    List<Invitation> findBySeatId_Id(Long seatId);

    List<Invitation> findByStatus(String status);

    List<Invitation> findByReceiverId_IdAndStatus(Long receiverId, String status);

    boolean existsByCreatedReservationId_Id(Long reservationId);
}