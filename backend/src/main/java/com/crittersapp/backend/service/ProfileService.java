package com.crittersapp.backend.service;

import com.crittersapp.backend.dto.ProfileResponse;
import com.crittersapp.backend.exception.InsufficientFundsException;
import com.crittersapp.backend.exception.NameAlreadyExistsException;
import com.crittersapp.backend.exception.ProfileNotFoundException;
import com.crittersapp.backend.model.Profile;
import com.crittersapp.backend.repository.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class ProfileService {

    private static final Set<String> VALID_CURRENCY_KEYS = Set.of("acorns", "treats", "flowers");

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    private ProfileResponse toResponse(Profile profile) {
        return new ProfileResponse(
                profile.getUserId(),
                profile.getName(),
                profile.getLevel(),
                profile.getXp(),
                profile.getAcorns(),
                profile.getTreats(),
                profile.getFlowers()
        );
    }

    private Profile getProfileOrThrow(String userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProfileNotFoundException("No profile found for this user."));
    }

    private void validateCurrencyKey(String currencyKey) {
        if (!VALID_CURRENCY_KEYS.contains(currencyKey)) {
            throw new IllegalArgumentException("Invalid currency key: " + currencyKey);
        }
    }

    private long getCurrencyAmount(Profile profile, String currencyKey) {
        return switch (currencyKey) {
            case "acorns" -> profile.getAcorns();
            case "treats" -> profile.getTreats();
            case "flowers" -> profile.getFlowers();
            default -> throw new IllegalArgumentException("Invalid currency key: " + currencyKey);
        };
    }

    private void applyCurrencyDelta(Profile profile, String currencyKey, long delta) {
        switch (currencyKey) {
            case "acorns" -> profile.setAcorns(profile.getAcorns() + delta);
            case "treats" -> profile.setTreats(profile.getTreats() + delta);
            case "flowers" -> profile.setFlowers(profile.getFlowers() + delta);
            default -> throw new IllegalArgumentException("Invalid currency key: " + currencyKey);
        }
    }

    public ProfileResponse createProfile(String userId, String name) {
        if (profileRepository.existsByUserId(userId)) {
            throw new IllegalStateException("This user already has a profile.");
        }
        if (profileRepository.existsByName(name)) {
            throw new NameAlreadyExistsException("That name is already taken.");
        }

        Profile profile = new Profile(userId, name.trim(), 1, 0, 0, 0, 0);
        profileRepository.save(profile);
        return toResponse(profile);
    }

    public ProfileResponse getProfile(String userId) {
        return toResponse(getProfileOrThrow(userId));
    }

    public ProfileResponse renameProfile(String userId, String newName) {
        if (profileRepository.existsByName(newName)) {
            throw new NameAlreadyExistsException("That name is already taken.");
        }

        Profile profile = getProfileOrThrow(userId);
        profile.setName(newName.trim());
        profileRepository.save(profile);
        return toResponse(profile);
    }

    // add xp, cascading level-ups whenever xp exceeds level*10 — same logic
    // your frontend's ProfileContext already had, reimplemented server-side
    public ProfileResponse addXp(String userId, int amount) {
        Profile profile = getProfileOrThrow(userId);

        int newXp = profile.getXp() + amount;
        int newLevel = profile.getLevel();
        while (newXp > newLevel * 10) {
            newXp -= newLevel * 10;
            newLevel++;
        }

        profile.setXp(newXp);
        profile.setLevel(newLevel);
        profileRepository.save(profile);
        return toResponse(profile);
    }

    public ProfileResponse earnCurrency(String userId, String currencyKey, int amount) {
        validateCurrencyKey(currencyKey);
        Profile profile = getProfileOrThrow(userId);

        applyCurrencyDelta(profile, currencyKey, amount);
        profileRepository.save(profile);
        return toResponse(profile);
    }

    public ProfileResponse spendCurrency(String userId, String currencyKey, int amount) {
        validateCurrencyKey(currencyKey);
        Profile profile = getProfileOrThrow(userId);

        long currentAmount = getCurrencyAmount(profile, currencyKey);
        if (currentAmount < amount) {
            throw new InsufficientFundsException("Not enough " + currencyKey + ".");
        }

        applyCurrencyDelta(profile, currencyKey, -amount);
        profileRepository.save(profile);
        return toResponse(profile);
    }

    // ★ Not exposed via its own controller endpoint yet — this is meant to
    // be called directly (same-JVM method call) by a future QuestService or
    // CrittersService when completing a quest / rescuing a critter grants
    // both xp and currency at once, mirroring grantReward() in your
    // frontend's ProfileContext. One atomic update, same reasoning as
    // there: avoids two separate saves risking a half-applied reward.
    public ProfileResponse grantReward(String userId, int xp, long acorns, long treats, long flowers) {
        Profile profile = getProfileOrThrow(userId);

        int newXp = profile.getXp() + xp;
        int newLevel = profile.getLevel();
        while (newXp > newLevel * 10) {
            newXp -= newLevel * 10;
            newLevel++;
        }

        profile.setXp(newXp);
        profile.setLevel(newLevel);
        profile.setAcorns(profile.getAcorns() + acorns);
        profile.setTreats(profile.getTreats() + treats);
        profile.setFlowers(profile.getFlowers() + flowers);

        profileRepository.save(profile);
        return toResponse(profile);
    }
}