package com.crittersapp.backend.repository;

import com.crittersapp.backend.model.Profile;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

// ⚠️ TEMPORARY — in-memory storage, purely to test frontend<->backend
// communication before MongoDB Atlas is wired up. Everything is lost on
// restart. Method names deliberately mirror Spring Data conventions
// (findByUserId, existsByName, save) so that swapping this out for a real
// `interface ProfileRepository extends MongoRepository<Profile, String>`
// later requires little to no change in ProfileService, which only calls
// these method names — not this implementation.
//
// Keyed directly by userId (no separate generated id — see Profile.java's
// comment on why), so lookups are a direct map access, not a stream/filter.
@Repository
public class ProfileRepository {

    private final ConcurrentHashMap<String, Profile> profiles = new ConcurrentHashMap<>();

    public Profile save(Profile profile) {
        if (profile.getUserId() == null) {
            throw new IllegalArgumentException("Profile must have a userId before saving.");
        }
        profiles.put(profile.getUserId(), profile);
        return profile;
    }

    public Optional<Profile> findByUserId(String userId) {
        return Optional.ofNullable(profiles.get(userId));
    }

    public boolean existsByUserId(String userId) {
        return profiles.containsKey(userId);
    }

    // for the sign-up flow's name-uniqueness check, mirroring what
    // ProfileContext.createProfile already did on the frontend
    public boolean existsByName(String name) {
        return profiles.values().stream()
                .anyMatch(p -> p.getName().equalsIgnoreCase(name));
    }

    public List<Profile> findAll() {
        return List.copyOf(profiles.values());
    }
}