package com.itsmartsystems.bookyourseat.repository;

import com.itsmartsystems.bookyourseat.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUser_Id(Integer userId);

    List<Notification> findByUser_IdOrderByCreatedAtDesc(Integer userId);

    List<Notification> findByUser_IdAndIsReadFalse(Integer userId);

    List<Notification> findByType(String type);

    List<Notification> findByUser_IdAndType(Integer userId, String type);

    long countByUser_IdAndIsReadFalse(Integer userId);

    Optional<Notification> findByInvitation_Id(Long invitationId);

    @Modifying
    @Query("""
        delete from Notification n
        where n.invitation is not null
        and n.invitation.startDateTime < :now
    """)
    void deletePastInvitationNotifications(@Param("now") LocalDateTime now);
    }