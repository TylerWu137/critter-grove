package com.crittersapp.backend.controller;

import com.crittersapp.backend.dto.CreateQuestRequest;
import com.crittersapp.backend.dto.QuestResponse;
import com.crittersapp.backend.dto.UpdateQuestRequest;
import com.crittersapp.backend.security.AuthenticatedUser;
import com.crittersapp.backend.service.QuestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quests")
public class QuestController {

    private final QuestService questService;

    public QuestController(QuestService questService) {
        this.questService = questService;
    }

    @GetMapping
    public ResponseEntity<List<QuestResponse>> getQuests() {
        String userId = AuthenticatedUser.getCurrentUserId();
        return ResponseEntity.ok(questService.getQuestsForUser(userId));
    }

    @PostMapping
    public ResponseEntity<QuestResponse> createQuest(@Valid @RequestBody CreateQuestRequest request) {
        String userId = AuthenticatedUser.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED).body(questService.createQuest(userId, request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<QuestResponse> updateQuest(
            @PathVariable String id,
            @Valid @RequestBody UpdateQuestRequest request
    ) {
        String userId = AuthenticatedUser.getCurrentUserId();
        return ResponseEntity.ok(questService.updateQuest(userId, id, request));
    }

    @PatchMapping("/{id}/toggle-completion")
    public ResponseEntity<QuestResponse> toggleCompletion(@PathVariable String id) {
        String userId = AuthenticatedUser.getCurrentUserId();
        return ResponseEntity.ok(questService.toggleCompletion(userId, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuest(@PathVariable String id) {
        String userId = AuthenticatedUser.getCurrentUserId();
        questService.deleteQuest(userId, id);
        return ResponseEntity.noContent().build();
    }
}
