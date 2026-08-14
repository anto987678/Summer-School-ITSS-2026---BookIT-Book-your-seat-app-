package com.itsmartsystems.bookyourseat.controller;

import com.itsmartsystems.bookyourseat.dto.InvitationRequest;
import com.itsmartsystems.bookyourseat.model.Invitation;
import com.itsmartsystems.bookyourseat.service.InvitationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invitations")
public class InvitationController {

    private final InvitationService invitationService;

    public InvitationController(InvitationService invitationService) {
        this.invitationService = invitationService;
    }

    @PostMapping
    public ResponseEntity<Invitation> createInvitation(@RequestBody InvitationRequest cerere) {
        Invitation savedInvitation = invitationService.createInvitation(cerere);
        return ResponseEntity.ok(savedInvitation);
    }

    @GetMapping("/pending/{userId}")
    public ResponseEntity<List<Invitation>> getPendingInvitations(@PathVariable Integer userId) {
        List<Invitation> pendingList = invitationService.getPendingInvitationsForUser(userId);
        return ResponseEntity.ok(pendingList);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<String> acceptInvitation(@PathVariable Long id) {
        invitationService.acceptInvitation(id);
        return ResponseEntity.ok("Invitatia a fost acceptata si rezervarea a fost creata automat.");
    }

    @PutMapping("/{id}/decline")
    public ResponseEntity<String> declineInvitation(@PathVariable Long id) {
        invitationService.declineInvitation(id);
        return ResponseEntity.ok("Invitatia a fost refuzata.");
    }
}