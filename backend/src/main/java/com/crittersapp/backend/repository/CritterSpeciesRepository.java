package com.crittersapp.backend.repository;

import com.crittersapp.backend.model.CritterSpecies;
import org.springframework.data.mongodb.repository.MongoRepository;

// findAll() comes free from MongoRepository — no custom methods needed at all
public interface CritterSpeciesRepository extends MongoRepository<CritterSpecies, String> {
}
