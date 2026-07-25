package com.crittersapp.backend.service;

import com.crittersapp.backend.dto.*;
import com.crittersapp.backend.exception.CompanionLimitReachedException;
import com.crittersapp.backend.exception.ForbiddenException;
import com.crittersapp.backend.exception.ResourceNotFoundException;
import com.crittersapp.backend.model.CritterSpecies;
import com.crittersapp.backend.model.OwnedCritter;
import com.crittersapp.backend.repository.CritterSpeciesRepository;
import com.crittersapp.backend.repository.OwnedCritterRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CrittersService {

    private static final int MAX_COMPANIONS = 6;

    private final OwnedCritterRepository ownedCritterRepository;
    private final CritterSpeciesRepository critterSpeciesRepository;

    public CrittersService(OwnedCritterRepository ownedCritterRepository, CritterSpeciesRepository critterSpeciesRepository) {
        this.ownedCritterRepository = ownedCritterRepository;
        this.critterSpeciesRepository = critterSpeciesRepository;
    }

    private OwnedCritterResponse toResponse(OwnedCritter c) {
        return new OwnedCritterResponse(c.getId(), c.getSpeciesId(), c.getLevel(), c.getXp(), c.isCompanion());
    }

    // same ownership-check pattern as QuestService.getOwnedQuestOrThrow
    private OwnedCritter getOwnedCritterOrThrow(String userId, String critterId) {
        OwnedCritter critter = ownedCritterRepository.findById(critterId)
                .orElseThrow(() -> new ResourceNotFoundException("Critter not found."));
        if (!critter.getUserId().equals(userId)) {
            throw new ForbiddenException("You don't have access to this critter.");
        }
        return critter;
    }

    public List<OwnedCritterResponse> getOwnedCritters(String userId) {
        return ownedCritterRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<CritterSpeciesResponse> getAllSpecies() {
        return critterSpeciesRepository.findAll().stream()
                .map(s -> new CritterSpeciesResponse(s.getId(), s.getName(), s.getRarity()))
                .toList();
    }

    public OwnedCritterResponse catchCritter(String userId, String speciesId) {
        critterSpeciesRepository.findById(speciesId)
                .orElseThrow(() -> new ResourceNotFoundException("Species not found."));

        OwnedCritter critter = new OwnedCritter(null, userId, speciesId, 1, 0, false);
        ownedCritterRepository.save(critter);
        return toResponse(critter);
    }

    // add foodAmt xp, cascading level-ups whenever xp exceeds level*10 —
    // same logic as ProfileService.addXp, just applied to a critter instead
    public OwnedCritterResponse feedCritter(String userId, String critterId, int foodAmt) {
        OwnedCritter critter = getOwnedCritterOrThrow(userId, critterId);

        int newXp = critter.getXp() + foodAmt;
        int newLevel = critter.getLevel();
        while (newXp > newLevel * 10) {
            newXp -= newLevel * 10;
            newLevel++;
        }

        critter.setXp(newXp);
        critter.setLevel(newLevel);
        ownedCritterRepository.save(critter);
        return toResponse(critter);
    }

    // direct add to companions, no swap partner needed — mirrors
    // addToCompanions() in your frontend CrittersContext
    public OwnedCritterResponse awakenCritter(String userId, String critterId) {
        OwnedCritter critter = getOwnedCritterOrThrow(userId, critterId);

        if (critter.isCompanion()) {
            return toResponse(critter); // already a companion, no-op
        }
        if (ownedCritterRepository.countCompanions(userId) >= MAX_COMPANIONS) {
            throw new CompanionLimitReachedException("Companion roster is full (max " + MAX_COMPANIONS + ").");
        }

        critter.setCompanion(true);
        ownedCritterRepository.save(critter);
        return toResponse(critter);
    }

    // mirrors hibernateCompanion() — no swap needed
    public OwnedCritterResponse hibernateCritter(String userId, String critterId) {
        OwnedCritter critter = getOwnedCritterOrThrow(userId, critterId);
        critter.setCompanion(false);
        ownedCritterRepository.save(critter);
        return toResponse(critter);
    }

    // mirrors swapWithCompanion() — flips both flags at once
    public OwnedCritterResponse swapCompanion(String userId, String critterId, String companionId) {
        OwnedCritter critter = getOwnedCritterOrThrow(userId, critterId);
        OwnedCritter companion = getOwnedCritterOrThrow(userId, companionId);

        if (critter.isCompanion() == companion.isCompanion()) {
            throw new IllegalArgumentException("One of these must be a companion and the other must not.");
        }

        boolean critterWasCompanion = critter.isCompanion();
        critter.setCompanion(companion.isCompanion());
        companion.setCompanion(critterWasCompanion);

        ownedCritterRepository.save(critter);
        ownedCritterRepository.save(companion);
        return toResponse(critter);
    }

    // mirrors releaseCritter()
    public void releaseCritter(String userId, String critterId) {
        getOwnedCritterOrThrow(userId, critterId); // throws if not found/not owned
        ownedCritterRepository.deleteById(critterId);
    }
}
