package com.crittersapp.backend.repository;

import com.crittersapp.backend.model.QuestTag;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class QuestTagRepository {

    private final ConcurrentHashMap<String, QuestTag> tags = new ConcurrentHashMap<>();

    public QuestTagRepository() {
        // seed the same default/global tags your frontend originally had
        // in questTags.js — userId null means visible to everyone
        save(new QuestTag(null, null, "school", "#7EA8BE"));
        save(new QuestTag(null, null, "family", "#A8C3A0"));
        save(new QuestTag(null, null, "art", "#E88C7D"));
        save(new QuestTag(null, null, "nutrition", "#F2C14E"));
    }

    public QuestTag save(QuestTag tag) {
        if (tag.getId() == null) {
            tag.setId(UUID.randomUUID().toString());
        }
        tags.put(tag.getId(), tag);
        return tag;
    }

    public Optional<QuestTag> findById(String id) {
        return Optional.ofNullable(tags.get(id));
    }

    // global tags (userId == null) plus this user's own — matches what
    // TagsSection should actually display
    public List<QuestTag> findVisibleToUser(String userId) {
        return tags.values().stream()
                .filter(t -> t.getUserId() == null || t.getUserId().equals(userId))
                .toList();
    }
}
