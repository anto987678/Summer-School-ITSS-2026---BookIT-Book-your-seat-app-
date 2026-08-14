package com.itsmartsystems.bookyourseat.service;

import com.itsmartsystems.bookyourseat.model.Invitation;
import com.itsmartsystems.bookyourseat.model.Notification;
import com.itsmartsystems.bookyourseat.model.PostgresUser;
import com.itsmartsystems.bookyourseat.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional(readOnly = true)
    public List<Notification> getNotificationsForUser(Integer userId) {
        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotificationsForUser(Integer userId) {
        return notificationRepository.findByUser_IdAndIsReadFalse(userId);
    }

    public long countUnreadNotificationsForUser(Integer userId) {
        return notificationRepository.countByUser_IdAndIsReadFalse(userId);
    }

    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notificarea nu exista."));

        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notificarea nu exista."));

        notificationRepository.delete(notification);
    }

    public Notification createInvitationNotification(Invitation invitation) {
        PostgresUser receiver = invitation.getReceiverId();
        PostgresUser sender = invitation.getSenderId();

        Notification notification = new Notification();
        notification.setUser(receiver);
        notification.setInvitation(invitation);
        notification.setTitle("Invitatie noua");
        notification.setMessage(sender.getName() + " te-a invitat la birou.");
        notification.setType("INVITATION");
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        return notificationRepository.save(notification);
    }

    public void markInvitationNotificationAsRead(Long invitationId) {
        notificationRepository.findByInvitation_Id(invitationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    public void deleteInvitationNotification(Long invitationId) {
        notificationRepository.findByInvitation_Id(invitationId)
                .ifPresent(notificationRepository::delete);
    }
}
