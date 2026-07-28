package com.crittersapp.backend.repository;

import com.crittersapp.backend.model.QuestTag;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface QuestTagRepository extends MongoRepository<QuestTag, String> {
    // Spring Data DOES support this exact "field IS NULL OR field = X"
    // pattern as a derived query name — reads as "userId is null OR
    // userId equals the given userId", which is exactly "global tags OR
    // this user's own tags"
    List<QuestTag> findByUserIdIsNullOrUserId(String userId);
}
