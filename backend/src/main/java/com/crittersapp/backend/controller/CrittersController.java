package com.crittersapp.backend.controller;

import com.crittersapp.backend.dto.*;
import com.crittersapp.backend.security.AuthenticatedUser;
import com.crittersapp.backend.service.CrittersService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/critters")
public class CrittersController {

    private final CrittersService crittersService;

    public CrittersController(CrittersService crittersService) {
        this.crittersService = crittersService;
    }

    @GetMapping
    public ResponseEntity<List<OwnedCritterResponse>> getOwnedCritters() {
        String userId = AuthenticatedUser.getCurrentUserId();
        return ResponseEntity.ok(crittersService.getOwnedCritters(userId));
    }

    // separate top-level path since species is global/shared, not
    // nested under a specific user's owned critters
    @GetMapping("/species")
    public ResponseEntity<List<CritterSpeciesResponse>> getAllSpecies() {
        return ResponseEntity.ok(crittersService.getAllSpecies());
    }

    @PostMapping
    public ResponseEntity<OwnedCritterResponse> catchCritter(@Valid @RequestBody CatchCritterRequest request) {
        String userId = AuthenticatedUser.getCurrentUserId();
        OwnedCritterResponse response = crittersService.catchCritter(userId, request.getSpeciesId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{id}/feed")
    public ResponseEntity<OwnedCritterResponse> feedCritter(
            @PathVariable String id,
            @Valid @RequestBody FeedCritterRequest request
    ) {
        String userId = AuthenticatedUser.getCurrentUserId();
        return ResponseEntity.ok(crittersService.feedCritter(userId, id, request.getAmount()));
    }

    @PostMapping("/{id}/awaken")
    public ResponseEntity<OwnedCritterResponse> awakenCritter(@PathVariable String id) {
        String userId = AuthenticatedUser.getCurrentUserId();
        return ResponseEntity.ok(crittersService.awakenCritter(userId, id));
    }

    @PostMapping("/{id}/hibernate")
    public ResponseEntity<OwnedCritterResponse> hibernateCritter(@PathVariable String id) {
        String userId = AuthenticatedUser.getCurrentUserId();
        return ResponseEntity.ok(crittersService.hibernateCritter(userId, id));
    }

    @PostMapping("/{id}/swap")
    public ResponseEntity<OwnedCritterResponse> swapCompanion(
            @PathVariable String id,
            @Valid @RequestBody SwapCompanionRequest request
    ) {
        String userId = AuthenticatedUser.getCurrentUserId();
        return ResponseEntity.ok(crittersService.swapCompanion(userId, id, request.getCompanionId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> releaseCritter(@PathVariable String id) {
        String userId = AuthenticatedUser.getCurrentUserId();
        crittersService.releaseCritter(userId, id);
        return ResponseEntity.noContent().build();
    }
}
