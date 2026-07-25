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

    // ★ THE OWNERSHIP CHECK PATTERN — every method that touches an existing
    // quest by id goes through this first. Two-step on purpose: first check
    // existence (404 if not found at all), THEN check ownership (403 if it
    // exists but belongs to someone else). Collapsing these into one check
    // would leak whether the id exists at all to an unauthorized caller.
    private Quest getOwnedQuestOrThrow(String userId, String questId) {
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new ResourceNotFoundException("Quest not found."));
        if (!quest.getUserId().equals(userId)) {
            throw new ForbiddenException("You don't have access to this quest.");
        }
        return quest;
    }

    public List<QuestResponse> getQuestsForUser(String userId) {
        // NOTE: returns ALL of this user's quests, unsorted/unfiltered by
        // type or tag — same as before, the frontend still does its own
        // getQuestsByType / tag-filtering / incomplete-then-completed
        // sorting client-side after fetching this list. Not duplicating
        // that logic here keeps this endpoint simple and keeps the
        // migration mostly about "where does the data come from," not
        // "rewrite all the display logic."
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
        // NOTE: the "wait 1.5s before visually moving to the bottom" delay
        // stays entirely a FRONTEND concern (setTimeout in QuestsContext) —
        // the backend just flips the boolean immediately and returns the
        // new state. Reordering-for-display was never a server concern.
    }

    public void deleteQuest(String userId, String questId) {
        getOwnedQuestOrThrow(userId, questId); // throws if not found/not owned
        questRepository.deleteById(questId);
    }

    public List<QuestTagResponse> getTagsForUser(String userId) {
        return questTagRepository.findVisibleToUser(userId).stream()
                .map(t -> new QuestTagResponse(t.getId(), t.getName(), t.getColor()))
                .toList();
    }

    public QuestTagResponse createTag(String userId, CreateQuestTagRequest request) {
        QuestTag tag = new QuestTag(null, userId, request.getName().trim(), request.getColor());
        questTagRepository.save(tag);
        return new QuestTagResponse(tag.getId(), tag.getName(), tag.getColor());
    }
}
