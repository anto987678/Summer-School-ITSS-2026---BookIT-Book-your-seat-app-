package com.itsmartsystems.bookyourseat.controller;

import com.itsmartsystems.bookyourseat.model.Seat;
import com.itsmartsystems.bookyourseat.repository.SeatRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class LocController {

    private final SeatRepository locRepository;

    public LocController(SeatRepository locRepository) {
        this.locRepository = locRepository;
    }

    @GetMapping("/locuri")
    public List<Seat> getAllLocuri() {
        return locRepository.findAll();
    }

    @GetMapping("/locuri/room/{salaId}")
    public List<Seat> getLocuriDinSala(@PathVariable String salaId) {
        return locRepository.findBySalaId(salaId);
    }
}