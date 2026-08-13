package com.itsmartsystems.bookyourseat.service;

import com.itsmartsystems.bookyourseat.dto.*;
import com.itsmartsystems.bookyourseat.model.PostgresUser;import com.itsmartsystems.bookyourseat.model.User;
import com.itsmartsystems.bookyourseat.repository.PostgresUserRepository;import com.itsmartsystems.bookyourseat.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final UserSyncService userSyncService;
    private final PostgresUserRepository postgresUserRepository;
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, EmailService emailService, UserSyncService userSyncService , PostgresUserRepository postgresUserRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.userSyncService = userSyncService;
        this.postgresUserRepository = postgresUserRepository;
    }

    // Method for checking the password
    private boolean checkPassword(String password)
    {
        if(password == null || password.length() == 0) return false;
        String specialChars = "!@#$%&*";
        int counter = 0;
        for(char c : password.toCharArray())
            if(specialChars.indexOf(c) != -1 ) counter++;
        if ( counter < 2 || password.length() < 10) return false;
        return true;
    }

    //  --- REGISTER ---
    public void register(RegisterRequest request){
        Optional<User> user0 = userRepository.findByEmail(request.getEmail());
        if(user0.isPresent()) throw new IllegalArgumentException("Email already registered !");
        if(request.getPassword() == null || request.getPassword().length() == 0) throw new IllegalArgumentException("Password must not be empty !");

        if(!checkPassword(request.getPassword())) throw new IllegalArgumentException("Password must contain at least 2 special chars and to be >= 10 chars");
        String crypted = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getName(), request.getEmail(), crypted, request.getRole(), true);
        User savedUser = userRepository.save(user);
        userSyncService.syncUser(savedUser);
    }

    // --- LOGIN ---
    public boolean login(LoginRequest request){
        Optional<User> u = userRepository.findByEmail(request.getEmail());
        Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        if (u.get().isFirstLog()) throw new IllegalArgumentException("Password must be changed before login !");

        handleFirstLogin(u.get());

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        // salvare explicită în sesiune HTTP
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletRequest httpRequest = attr.getRequest();
        HttpServletResponse httpResponse = attr.getResponse();
        SecurityContextRepository repo = new HttpSessionSecurityContextRepository();
        repo.saveContext(context, httpRequest, httpResponse);

        return false;
    }

    // --- PASSWORD MUST BE CHANGED ---
    public void changePassword(ChangePasswordRequest request){
        Optional<User> u = userRepository.findByEmail(request.getEmail());
        // -- Validations for every field --
        if(u.isEmpty()) throw new IllegalArgumentException("Email isnt registered !");
        if(request.getOldPassword() == null || request.getOldPassword().length() == 0 ) throw new IllegalArgumentException("OldPassword must not be empty !");
        if(request.getNewPassword() == null || request.getNewPassword().length() == 0 ) throw new IllegalArgumentException("NewPassword must not be empty !");
        if(!passwordEncoder.matches(request.getOldPassword(), u.get().getPassword())) throw new IllegalArgumentException("Passwords doesnt match !");

        if(!checkPassword(request.getNewPassword())) throw new IllegalArgumentException("Password must contain at least 2 special chars and to be >= 10 chars");
       
         handleFirstLogin(u.get());
       
        String crypted = passwordEncoder.encode(request.getNewPassword());
        User existingUser = u.get();
        existingUser.setPassword(crypted);
        existingUser.setFirstLog(false);
        userRepository.save(existingUser);
    }

    public void emailRequestforChanging(EmailRequest request) throws MessagingException {
        // -- VERIFY THE EMAIL FIRST
        //if(request.getEmail().endsWith("@itsmartsystems.eu") == false) throw new IllegalArgumentException("Wrong email !");
        Optional<User> u = userRepository.findByEmail(request.getEmail());
        if(u.isEmpty()) throw new IllegalArgumentException("User field is empty !");
        String token = String.valueOf(UUID.randomUUID());
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(15);
        User user = u.get();
        user.setToken(token);
        user.setTokenExpiresAt(expiresAt);
        User savedUser = userRepository.save(user);
        userSyncService.syncUser(savedUser);
        emailService.emailToSend(user.getEmail(), token);
    }

    public void handleFirstLogin(User user) {
        if (!user.isFirstLog()) {
            return;
        }

        userSyncService.syncUser(user);

        user.setFirstLog(false);
        User savedUser = userRepository.save(user);
        userSyncService.syncUser(savedUser);
    }

    public void forgotPassword(ChangeNewPasswordRequest request)
    {
        if(!request.getNewPassword().equals(request.getcNewPassword())) throw new IllegalArgumentException("Passwords must be the same !");
        if(!checkPassword(request.getcNewPassword())) throw new IllegalArgumentException("Password must contain at least 2 special chars and to be >= 10 chars !");

        Optional<User> u = userRepository.findByToken(request.token());

        if(u.isEmpty()) throw new IllegalArgumentException("User doesnt exist !");
        LocalDateTime now = LocalDateTime.now();
        if(now.isAfter(u.get().getTokenExpiresAt()) == true ) throw new IllegalArgumentException("Expired session !");

        User user = u.get();
        String crypted = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(crypted);
        user.setToken(null);
        // after the user changed the password one time the token will be null
        // so that he cant reset the password 30 times in 15 minutes
        User savedUser = userRepository.save(user);
        userSyncService.syncUser(savedUser);
    }

    public UserDetails UserDet() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("User is not authenticated !");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User doesnt exist !"));

        return new UserDetails(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}