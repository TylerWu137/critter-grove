package com.crittersapp.backend.controller;

import com.crittersapp.backend.dto.CreateProfileRequest;
import com.crittersapp.backend.dto.CurrencyRequest;
import com.crittersapp.backend.dto.ProfileResponse;
import com.crittersapp.backend.dto.RenameRequest;
import com.crittersapp.backend.dto.XpRequest;
import com.crittersapp.backend.security.AuthenticatedUser;
import com.crittersapp.backend.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // NOTE: every method below calls AuthenticatedUser.getCurrentUserId()
    // to figure out whose profile to touch — never trust a userId sent in
    // a request body for this. The token in the Authorization header
    // (already validated by JwtAuthFilter before this code even runs) is
    // the only source of truth for identity.

    @PostMapping
    public ResponseEntity<ProfileResponse> createProfile(@Valid @RequestBody CreateProfileRequest request) {
        String userId = AuthenticatedUser.getCurrentUserId();
        ProfileResponse response = profileService.createProfile(userId, request.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile() {
        String userId = AuthenticatedUser.getCurrentUserId();
        ProfileResponse response = profileService.getProfile(userId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/name")
    public ResponseEntity<ProfileResponse> renameProfile(@Valid @RequestBody RenameRequest request) {
        String userId = AuthenticatedUser.getCurrentUserId();
        ProfileResponse response = profileService.renameProfile(userId, request.getName());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/xp")
    public ResponseEntity<ProfileResponse> addXp(@Valid @RequestBody XpRequest request) {
        String userId = AuthenticatedUser.getCurrentUserId();
        ProfileResponse response = profileService.addXp(userId, request.getAmount());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/currency/earn")
    public ResponseEntity<ProfileResponse> earnCurrency(@Valid @RequestBody CurrencyRequest request) {
        String userId = AuthenticatedUser.getCurrentUserId();
        ProfileResponse response = profileService.earnCurrency(userId, request.getCurrencyKey(), request.getAmount());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/currency/spend")
    public ResponseEntity<ProfileResponse> spendCurrency(@Valid @RequestBody CurrencyRequest request) {
        String userId = AuthenticatedUser.getCurrentUserId();
        ProfileResponse response = profileService.spendCurrency(userId, request.getCurrencyKey(), request.getAmount());
        return ResponseEntity.ok(response);
    }
}