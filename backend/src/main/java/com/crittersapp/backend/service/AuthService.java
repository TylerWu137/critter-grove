package com.crittersapp.backend.service;

import com.crittersapp.backend.dto.AuthResponse;
import com.crittersapp.backend.dto.LoginRequest;
import com.crittersapp.backend.dto.SignUpRequest;
import com.crittersapp.backend.exception.EmailAlreadyExistsException;
import com.crittersapp.backend.exception.InvalidCredentialsException;
import com.crittersapp.backend.model.User;
import com.crittersapp.backend.repository.UserRepository;
import com.crittersapp.backend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ProfileService profileService; // ★ ADDED

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            ProfileService profileService // ★ ADDED
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.profileService = profileService; // ★ ADDED
    }

    public AuthResponse signUp(SignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("That email is already registered.");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword())); // never store the raw password
        userRepository.save(user);

        // ★ ADDED — compensating transaction: if profile creation fails
        // (e.g. the requested name is already taken), delete the user we
        // just created so we don't leave an orphaned account with no
        // profile. Re-throwing the SAME exception preserves its type
        // (NameAlreadyExistsException, etc.), so GlobalExceptionHandler
        // still returns the correct, specific error to the client.
        try {
            profileService.createProfile(user.getId(), request.getName());
        } catch (RuntimeException ex) {
            userRepository.deleteById(user.getId());
            throw ex;
        }

        String token = jwtUtil.generateToken(user.getId());
        return new AuthResponse(token, user.getId(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Incorrect email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Incorrect email or password.");
        }

        String token = jwtUtil.generateToken(user.getId());
        return new AuthResponse(token, user.getId(), user.getEmail());
    }

    // used by the /api/auth/me endpoint — lets the frontend verify a stored
    // token is still valid and rehydrate "who's logged in" after a page refresh
    public AuthResponse getCurrentUserInfo(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new InvalidCredentialsException("User not found."));
        // no need to issue a new token here, just echo back identity info;
        // reuse AuthResponse's shape so the frontend doesn't need a separate type
        return new AuthResponse(null, user.getId(), user.getEmail());
    }
}