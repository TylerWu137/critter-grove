package com.crittersapp.backend.controller;

import com.crittersapp.backend.dto.CreateQuestTagRequest;
import com.crittersapp.backend.dto.QuestTagResponse;
import com.crittersapp.backend.security.AuthenticatedUser;
import com.crittersapp.backend.service.QuestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quest-tags")
public class QuestTagController {

    private final QuestService questService;

    public QuestTagController(QuestService questService) {
        this.questService = questService;
    }

    @GetMapping
    public ResponseEntity<List<QuestTagResponse>> getTags() {
        String userId = AuthenticatedUser.getCurrentUserId();
        return ResponseEntity.ok(questService.getTagsForUser(userId));
    }

    @PostMapping
    public ResponseEntity<QuestTagResponse> createTag(@Valid @RequestBody CreateQuestTagRequest request) {
        String userId = AuthenticatedUser.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED).body(questService.createTag(userId, request));
    }
}
