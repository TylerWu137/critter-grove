package com.crittersapp.backend.service;

import com.crittersapp.backend.dto.*;
import com.crittersapp.backend.exception.ForbiddenException;
import com.crittersapp.backend.exception.ResourceNotFoundException;
import com.crittersapp.backend.model.Quest;
import com.crittersapp.backend.model.QuestTag;
import com.crittersapp.backend.repository.QuestRepository;
import com.crittersapp.backend.repository.QuestTagRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestService {

    private final QuestRepository questRepository;
    private final QuestTagRepository questTagRepository;

    public QuestService(QuestRepository questRepository, QuestTagRepository questTagRepository) {
        this.questRepository = questRepository;
        this.questTagRepository = questTagRepository;
    }

    private QuestResponse toResponse(Quest q) {
        return new QuestResponse(q.getId(), q.getType(), q.getName(), q.getTagId(), q.getDate(), q.getTime(), q.isCompleted());
    }

    private Quest getOwnedQuestOrThrow(String userId, String questId) {
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new ResourceNotFoundException("Quest not found."));
        if (!quest.getUserId().equals(userId)) {
            throw new ForbiddenException("You don't have access to this quest.");
        }
        return quest;
    }

    public List<QuestResponse> getQuestsForUser(String userId) {
        return questRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public QuestResponse createQuest(String userId, CreateQuestRequest request) {
        Quest quest = new Quest(
                null,
                userId,
                request.getType(),
                request.getTagId(),
                request.getName().trim(),
                request.getDate(),
                request.getTime(),
                false
        );
        questRepository.save(quest);
        return toResponse(quest);
    }

    public QuestResponse updateQuest(String userId, String questId, UpdateQuestRequest request) {
        Quest quest = getOwnedQuestOrThrow(userId, questId);
        quest.setType(request.getType());
        quest.setName(request.getName().trim());
        quest.setTagId(request.getTagId());
        quest.setDate(request.getDate());
        quest.setTime(request.getTime());
        questRepository.save(quest);
        return toResponse(quest);
    }

    public QuestResponse toggleCompletion(String userId, String questId) {
        Quest quest = getOwnedQuestOrThrow(userId, questId);
        quest.setCompleted(!quest.isCompleted());
        questRepository.save(quest);
        return toResponse(quest);
    }

    public void deleteQuest(String userId, String questId) {
        getOwnedQuestOrThrow(userId, questId);
        questRepository.deleteById(questId);
    }

    public List<QuestTagResponse> getTagsForUser(String userId) {
        // ★ CHANGED — was findVisibleToUser (a method that only existed on
        // the old hand-written class); now calls the Spring Data derived
        // query directly by its real name
        return questTagRepository.findByUserIdIsNullOrUserId(userId).stream()
                .map(t -> new QuestTagResponse(t.getId(), t.getName(), t.getColor()))
                .toList();
    }

    public QuestTagResponse createTag(String userId, CreateQuestTagRequest request) {
        QuestTag tag = new QuestTag(null, userId, request.getName().trim(), request.getColor());
        questTagRepository.save(tag);
        return new QuestTagResponse(tag.getId(), tag.getName(), tag.getColor());
    }
}
