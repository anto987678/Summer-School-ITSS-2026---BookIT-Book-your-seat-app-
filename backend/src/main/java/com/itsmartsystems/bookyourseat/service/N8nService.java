package com.itsmartsystems.bookyourseat.service;

import com.itsmartsystems.bookyourseat.Status;
import com.itsmartsystems.bookyourseat.model.Invitation;
import com.itsmartsystems.bookyourseat.model.PostgresUser;
import com.itsmartsystems.bookyourseat.model.Reservation;
import com.itsmartsystems.bookyourseat.model.Room;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class N8nService {

    private static final Map<Status, String> STATUS_COLORS = Map.of(
            Status.APPROVED, "#DC2626",
            Status.ACCEPTED, "#DC2626",
            Status.PENDING, "#CA8A04",
            Status.REJECTED, "#DC2626",
            Status.DECLINED, "#DC2626");

    @Value("${n8n.reservation-verification.webhook.url:${n8n.webhook.url:}}")
    private String reservationWebhook;

    @Value("${n8n.reminder.webhook.url:}")
    private String reminderWebhook;

    @Value("${n8n.manager.approval.webhook.url:${N8N_MANAGER_APPROVAL_WEBHOOK_URL:}}")
    private String managerApprovalWebhook;

    @Value("${n8n.invitation.webhook.url:}")
    private String invitationWebhook;

    @Value("${n8n.invitation-response.webhook.url:}")
    private String invitationResponseWebhook;

    private final RestClient restClient;

    public N8nService(RestClient restClient) {
        this.restClient = restClient;
    }

    @Async
    public void sendReservationNotification(Reservation reservation) {
        postPayload(reservationWebhook, buildReservationPayload(reservation), "reservation");
    }

    @Async
    public void sendReminderNotification(Reservation reservation) {
        postPayload(reminderWebhook, buildReservationPayload(reservation), "reminder");
    }

    @Async
    public void sendRecurringReservationApprovalRequest(Reservation reservation, List<PostgresUser> approvers) {
        if (approvers == null || approvers.isEmpty()) {
            return;
        }

        Map<String, Object> payload = buildReservationPayload(reservation);
        payload.put("reservationId", reservation.getId());
        payload.put("requesterName", reservation.getUser() == null ? null : reservation.getUser().getName());
        payload.put("requesterEmail", reservation.getUser() == null ? null : reservation.getUser().getEmail());
        payload.put("recurrence", reservation.getRecurrence());
        payload.put("approvers", approvers.stream()
                .map(approver -> Map.of("name", approver.getName(), "email", approver.getEmail()))
                .toList());

        postPayload(managerApprovalWebhook, payload, "manager approval");
    }

    @Async
    public void sendInvitationNotification(Invitation invitation) {
        Map<String, Object> payload = buildInvitationPayload(invitation);
        postPayload(invitationWebhook, payload, "invitation");
    }

    @Async
    public void sendInvitationResponseNotification(Invitation invitation) {
        Map<String, Object> payload = buildInvitationPayload(invitation);
        payload.put("senderEmail", invitation.getSenderId() == null ? null : invitation.getSenderId().getEmail());
        payload.put("receiverEmail", invitation.getReceiverId() == null ? null : invitation.getReceiverId().getEmail());
        postPayload(invitationResponseWebhook, payload, "invitation response");
    }

    private Map<String, Object> buildReservationPayload(Reservation reservation) {
        Room room = reservation.getRoom();
        if (room == null && reservation.getSeat() != null) {
            room = reservation.getSeat().getRoom();
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("email", reservation.getUser() == null ? null : reservation.getUser().getEmail());
        payload.put("userName", reservation.getUser() == null ? null : reservation.getUser().getName());
        payload.put("roomCode", room == null ? null : room.getCode());
        payload.put("roomName", room == null ? null : room.getName());
        payload.put("seatCode", reservation.getSeat() == null ? null : reservation.getSeat().getCode());
        payload.put("startDateTime", reservation.getStartDateTime() == null ? null : reservation.getStartDateTime().toString());
        payload.put("endDateTime", reservation.getEndDateTime() == null ? null : reservation.getEndDateTime().toString());
        payload.put("statusLabel", reservation.getStatus() == null ? null : reservation.getStatus().name());
        payload.put("statusColor", reservation.getStatus() == null ? null : STATUS_COLORS.get(reservation.getStatus()));
        return payload;
    }

    private Map<String, Object> buildInvitationPayload(Invitation invitation) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("invitationId", invitation.getId());
        payload.put("status", invitation.getStatus());
        payload.put("senderName", invitation.getSenderId() == null ? null : invitation.getSenderId().getName());
        payload.put("senderEmail", invitation.getSenderId() == null ? null : invitation.getSenderId().getEmail());
        payload.put("receiverName", invitation.getReceiverId() == null ? null : invitation.getReceiverId().getName());
        payload.put("receiverEmail", invitation.getReceiverId() == null ? null : invitation.getReceiverId().getEmail());
        payload.put("seatCode", invitation.getSeatId() == null ? null : invitation.getSeatId().getCode());
        payload.put("roomCode", invitation.getSeatId() == null ? null : invitation.getSeatId().getRoom().getCode());
        payload.put("roomName", invitation.getSeatId() == null ? null : invitation.getSeatId().getRoom().getName());
        payload.put("startDateTime", invitation.getStartDateTime() == null ? null : invitation.getStartDateTime().toString());
        payload.put("endDateTime", invitation.getEndDateTime() == null ? null : invitation.getEndDateTime().toString());
        payload.put("respondedAt", invitation.getRespondedAt() == null ? null : invitation.getRespondedAt().toString());
        return payload;
    }

    private void postPayload(String webhook, Map<String, Object> payload, String type) {
        if (!StringUtils.hasText(webhook)) {
            return;
        }

        try {
            restClient.post()
                    .uri(webhook)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            System.err.println("Failed to send n8n " + type + " notification: " + e.getMessage());
        }
    }
}