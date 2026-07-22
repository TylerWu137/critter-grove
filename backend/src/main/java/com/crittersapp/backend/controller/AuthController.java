package com.crittersapp.backend.controller;

import com.crittersapp.backend.dto.AuthResponse;
import com.crittersapp.backend.dto.LoginRequest;
import com.crittersapp.backend.dto.SignUpRequest;
import com.crittersapp.backend.security.AuthenticatedUser;
import com.crittersapp.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        AuthResponse response = authService.signUp(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // protected — requires a valid Authorization: Bearer <token> header.
    // Frontend calls this on app load to check "is my stored token still
    // valid" and restore the logged-in state without re-entering credentials.
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me() {
        String userId = AuthenticatedUser.getCurrentUserId();
        AuthResponse response = authService.getCurrentUserInfo(userId);
        return ResponseEntity.ok(response);
    }
}
