package com.crittersapp.backend.repository;

import com.crittersapp.backend.model.Quest;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class QuestRepository {

    private final ConcurrentHashMap<String, Quest> quests = new ConcurrentHashMap<>();

    public Quest save(Quest quest) {
        if (quest.getId() == null) {
            quest.setId(UUID.randomUUID().toString());
        }
        quests.put(quest.getId(), quest);
        return quest;
    }

    public Optional<Quest> findById(String id) {
        return Optional.ofNullable(quests.get(id));
    }

    public List<Quest> findByUserId(String userId) {
        return quests.values().stream()
                .filter(q -> q.getUserId().equals(userId))
                .toList();
    }

    public void deleteById(String id) {
        quests.remove(id);
    }
}
