package com.crittersapp.backend.config;

import com.crittersapp.backend.model.CritterSpecies;
import com.crittersapp.backend.repository.CritterSpeciesRepository;
import com.crittersapp.backend.repository.QuestTagRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// ★ NEW FILE — replaces the seed-data-in-constructor pattern the old
// in-memory repositories used. CommandLineRunner runs once at app startup.
// The count() > 0 check is CRITICAL: without it, every restart/redeploy
// would insert duplicate seed rows into MongoDB, since (unlike the old
// in-memory version) this data now genuinely persists between runs.
@Component
public class DataSeeder implements CommandLineRunner {

    private final CritterSpeciesRepository critterSpeciesRepository;

    public DataSeeder(QuestTagRepository questTagRepository, CritterSpeciesRepository critterSpeciesRepository) {
        this.critterSpeciesRepository = critterSpeciesRepository;
    }

    @Override
    public void run(String... args) {
        seedCritterSpecies();
    }

    private void seedCritterSpecies() {
        if (critterSpeciesRepository.count() > 0) return;

        critterSpeciesRepository.save(new CritterSpecies(null, "Leafling", "common"));
        critterSpeciesRepository.save(new CritterSpecies(null, "Ember", "rare"));
        critterSpeciesRepository.save(new CritterSpecies(null, "Pebble", "common"));
        critterSpeciesRepository.save(new CritterSpecies(null, "Breeze", "uncommon"));
        critterSpeciesRepository.save(new CritterSpecies(null, "Moonpaw", "epic"));
        critterSpeciesRepository.save(new CritterSpecies(null, "Spark", "common"));
        critterSpeciesRepository.save(new CritterSpecies(null, "Mossy", "common"));
        critterSpeciesRepository.save(new CritterSpecies(null, "Cinder", "rare"));
        critterSpeciesRepository.save(new CritterSpecies(null, "Willow", "uncommon"));
        critterSpeciesRepository.save(new CritterSpecies(null, "Aurora", "legendary"));
    }
}
