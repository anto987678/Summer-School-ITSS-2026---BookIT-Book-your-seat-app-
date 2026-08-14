package com.itsmartsystems.bookyourseat.controller;

import com.itsmartsystems.bookyourseat.dto.NotificationResponse;
import com.itsmartsystems.bookyourseat.model.Notification;
import com.itsmartsystems.bookyourseat.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>> getNotificationsForUser(@PathVariable Integer userId) {
        List<NotificationResponse> notifications = notificationService.getNotificationsForUser(userId)
                .stream()
                .map(NotificationResponse::new)
                .toList();

        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotificationsForUser(@PathVariable Integer userId) {
        List<NotificationResponse> notifications = notificationService.getUnreadNotificationsForUser(userId)
                .stream()
                .map(NotificationResponse::new)
                .toList();

        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Map<String, Long>> countUnreadNotificationsForUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(Map.of("count", notificationService.countUnreadNotificationsForUser(userId)));
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long notificationId) {
        Notification notification = notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(new NotificationResponse(notification));
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.noContent().build();
    }


    @DeleteMapping("/past")
    public ResponseEntity<Void> deletePastInvitationNotifications() {
        notificationService.deletePastInvitationNotifications();
        return ResponseEntity.noContent().build();
    }
}