package com.crittersapp.backend.repository;

import com.crittersapp.backend.model.OwnedCritter;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OwnedCritterRepository extends MongoRepository<OwnedCritter, String> {
    List<OwnedCritter> findByUserId(String userId);
    long countByUserIdAndIsCompanionTrue(String userId); // "True" is a supported keyword for boolean properties
}
