package com.itsmartsystems.bookyourseat.controller;

import com.itsmartsystems.bookyourseat.dto.ReservationRequest;
import com.itsmartsystems.bookyourseat.model.Reservation;
import com.itsmartsystems.bookyourseat.model.User;
import com.itsmartsystems.bookyourseat.repository.UserRepository;
import com.itsmartsystems.bookyourseat.service.AprobareRezervareService;
import com.itsmartsystems.bookyourseat.service.RezervareService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
public class RezervareController {

    private final AprobareRezervareService aprobareRezervareService;
    private final RezervareService rezervareService;
    private final UserRepository userRepository;

    public RezervareController(AprobareRezervareService aprobareRezervareService, RezervareService rezervareService,
            UserRepository userRepository) {
        this.aprobareRezervareService = aprobareRezervareService;
        this.rezervareService = rezervareService;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty())
            throw new IllegalArgumentException("Utilizator inexistent!");
        return user.get();
    }

    @PutMapping("/rezervari/{id}/aproba")
    public Reservation aprobaRezervare(@PathVariable String id) {
        return aprobareRezervareService.aprobaRezervare(id);
    }

    @PutMapping("/rezervari/{id}/respinge")
    public Reservation respingeRezervare(@PathVariable String id, @RequestParam String motiv) {
        return aprobareRezervareService.respingeRezervare(id, motiv);
    }

    @PostMapping("/rezervari")
    public void creareRezervare(@Valid @RequestBody ReservationRequest request) {
        User user = getCurrentUser();
        rezervareService.creareRezervare(
                user.getId(),
                request.getSpaceId(),
                request.getSeatId(),
                request.getStartTime(),
                request.getEndTime(),
                request.getBookingType(),
                request.getDataSfarsitRecurenta());
    }

    @PutMapping("/rezervari/{id}")
    public Reservation modificareRezervare(@PathVariable String id, @Valid @RequestBody ReservationRequest request) {
        User user = getCurrentUser();
        return rezervareService.modificareRezervare(
                id,
                user.getId(),
                request.getSpaceId(),
                request.getSeatId(),
                request.getStartTime(),
                request.getEndTime(),
                request.getBookingType());
    }

    @DeleteMapping("/rezervari/{id}")
    public void stergereRezervare(@PathVariable String id) {
        rezervareService.stergereRezervare(id);
    }

    @GetMapping("/rezervari/istoric")
    public List<Reservation> istoricRezervari() {
        User user = getCurrentUser();
        return rezervareService.istoricRezervari(user.getId());
    }

    @GetMapping("/rezervari/pending")
    public List<Reservation> rezervariPending() {
        User user = getCurrentUser();
        if (!(user.getRole() == User.Role.PM || user.getRole() == User.Role.CEO
                || user.getRole() == User.Role.MANAGER)) {
            throw new IllegalArgumentException("Nu aveți acces la această listă!");
        }
        return rezervareService.rezervariInAsteptare();
    }

    @GetMapping("/rezervari/ocupate")
    public List<String> locuriOcupate(@RequestParam String idSala, @RequestParam String oraInceput,
            @RequestParam String oraSfarsit) {
        LocalDateTime start = LocalDateTime.parse(oraInceput);
        LocalDateTime end = LocalDateTime.parse(oraSfarsit);
        return rezervareService.locuriOcupate(idSala, start, end);
    }
}