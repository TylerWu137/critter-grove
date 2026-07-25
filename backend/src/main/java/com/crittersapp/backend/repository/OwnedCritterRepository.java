package com.crittersapp.backend.repository;

import com.crittersapp.backend.model.OwnedCritter;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class OwnedCritterRepository {

    private final ConcurrentHashMap<String, OwnedCritter> owned = new ConcurrentHashMap<>();

    public OwnedCritter save(OwnedCritter critter) {
        if (critter.getId() == null) {
            critter.setId(UUID.randomUUID().toString());
        }
        owned.put(critter.getId(), critter);
        return critter;
    }

    public Optional<OwnedCritter> findById(String id) {
        return Optional.ofNullable(owned.get(id));
    }

    public List<OwnedCritter> findByUserId(String userId) {
        return owned.values().stream()
                .filter(c -> c.getUserId().equals(userId))
                .toList();
    }

    public long countCompanions(String userId) {
        return owned.values().stream()
                .filter(c -> c.getUserId().equals(userId) && c.isCompanion())
                .count();
    }

    public void deleteById(String id) {
        owned.remove(id);
    }
}
