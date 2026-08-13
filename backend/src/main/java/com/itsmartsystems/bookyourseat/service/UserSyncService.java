package com.itsmartsystems.bookyourseat.service;

import com.itsmartsystems.bookyourseat.model.PostgresUser;
import com.itsmartsystems.bookyourseat.model.User;
import com.itsmartsystems.bookyourseat.repository.PostgresUserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserSyncService {
    private final PostgresUserRepository postgresUserRepository;

    public UserSyncService(PostgresUserRepository postgresUserRepository) {
        this.postgresUserRepository = postgresUserRepository;
    }

    public PostgresUser syncUser(User mongoUser) {
        PostgresUser postgresUser = postgresUserRepository.findByMongoUserId(mongoUser.getId()).orElseGet(PostgresUser::new);

        postgresUser.setMongoUserId(mongoUser.getId());
        postgresUser.setName(mongoUser.getName());
        postgresUser.setEmail(mongoUser.getEmail());
        postgresUser.setRole(mongoUser.getRole().name());

        return postgresUserRepository.save(postgresUser);
    }

    public void syncUsers(Iterable<User> mongoUsers) {
        for (User mongoUser : mongoUsers) {
            syncUser(mongoUser);
        }
    }
}