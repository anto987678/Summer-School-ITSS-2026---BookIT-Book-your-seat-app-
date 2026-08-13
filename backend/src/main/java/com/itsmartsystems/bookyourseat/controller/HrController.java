package com.itsmartsystems.bookyourseat.controller;

import com.itsmartsystems.bookyourseat.dto.UserDetails;
import com.itsmartsystems.bookyourseat.service.HrService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/hr")
public class HrController {

    private final HrService hrService;

    public HrController(HrService hrService) {
        this.hrService = hrService;
    }

    @GetMapping("/users")
    public List<UserDetails> getAllUsers() {
        return hrService.getAllUsers();
    }
}