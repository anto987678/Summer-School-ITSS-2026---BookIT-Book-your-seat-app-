package com.itsmartsystems.bookyourseat.service;

import com.itsmartsystems.bookyourseat.dto.UserDetails;
import com.itsmartsystems.bookyourseat.model.PostgresUser;
import com.itsmartsystems.bookyourseat.model.User;
import com.itsmartsystems.bookyourseat.repository.PostgresUserRepository;
import com.itsmartsystems.bookyourseat.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HrService {

    private final UserRepository userRepository;
    private final PostgresUserRepository postgresUserRepository;

    public HrService(UserRepository userRepository, PostgresUserRepository postgresUserRepository) {
        this.userRepository = userRepository;
        this.postgresUserRepository = postgresUserRepository;
    }

    public List<UserDetails> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toUserDetails)
                .toList();
    }

    private UserDetails toUserDetails(User user) {
        Integer postgresUserId = postgresUserRepository.findByEmail(user.getEmail())
                .map(PostgresUser::getId)
                .orElse(null);

        return new UserDetails(
                user.getId(),
                postgresUserId,
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}