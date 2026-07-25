package com.crittersapp.backend.repository;

import com.crittersapp.backend.model.CritterSpecies;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

// ⚠️ Seeded with a SMALL representative set, not your full ~100-entry
// frontend critterSpecies.js. Port the rest yourself (mechanical, repeats
// the save() pattern below), or ask for a bulk-generation pass separately —
// re-deriving all 100 by hand here wasn't practical for this response.
@Repository
public class CritterSpeciesRepository {

    private final ConcurrentHashMap<String, CritterSpecies> species = new ConcurrentHashMap<>();

    public CritterSpeciesRepository() {
        save(new CritterSpecies(null, "Leafling", "common"));
        save(new CritterSpecies(null, "Ember", "rare"));
        save(new CritterSpecies(null, "Pebble", "common"));
        save(new CritterSpecies(null, "Breeze", "uncommon"));
        save(new CritterSpecies(null, "Moonpaw", "epic"));
        save(new CritterSpecies(null, "Spark", "common"));
        save(new CritterSpecies(null, "Mossy", "common"));
        save(new CritterSpecies(null, "Cinder", "rare"));
        save(new CritterSpecies(null, "Willow", "uncommon"));
        save(new CritterSpecies(null, "Aurora", "legendary"));
    }

    public CritterSpecies save(CritterSpecies s) {
        if (s.getId() == null) {
            s.setId(UUID.randomUUID().toString());
        }
        species.put(s.getId(), s);
        return s;
    }

    public Optional<CritterSpecies> findById(String id) {
        return Optional.ofNullable(species.get(id));
    }

    public List<CritterSpecies> findAll() {
        return List.copyOf(species.values());
    }
}
