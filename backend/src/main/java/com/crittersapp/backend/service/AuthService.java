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
    private final ProfileService profileService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            ProfileService profileService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.profileService = profileService;
    }

    public AuthResponse signUp(SignUpRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) { // ★ CHANGED — added IgnoreCase
            throw new EmailAlreadyExistsException("That email is already registered.");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

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
        User user = userRepository.findByEmailIgnoreCase(request.getEmail()) // ★ CHANGED — added IgnoreCase
                .orElseThrow(() -> new InvalidCredentialsException("Incorrect email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Incorrect email or password.");
        }

        String token = jwtUtil.generateToken(user.getId());
        return new AuthResponse(token, user.getId(), user.getEmail());
    }

    public AuthResponse getCurrentUserInfo(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new InvalidCredentialsException("User not found."));
        return new AuthResponse(null, user.getId(), user.getEmail());
    }
}
