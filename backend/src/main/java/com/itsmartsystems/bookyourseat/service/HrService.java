package com.itsmartsystems.bookyourseat.service;

import com.itsmartsystems.bookyourseat.dto.UserDetails;
import com.itsmartsystems.bookyourseat.model.User;
import com.itsmartsystems.bookyourseat.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HrService {

    private final UserRepository userRepository;

    public HrService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDetails> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toUserDetails)
                .toList();
    }

    private UserDetails toUserDetails(User user) {
        return new UserDetails(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}