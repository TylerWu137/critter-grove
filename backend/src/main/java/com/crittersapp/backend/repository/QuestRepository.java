package com.crittersapp.backend.repository;

import com.crittersapp.backend.model.Quest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface QuestRepository extends MongoRepository<Quest, String> {
    List<Quest> findByUserId(String userId);
}
