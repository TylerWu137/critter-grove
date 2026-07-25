package com.crittersapp.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuestResponse {
    private String id;
    private String type;
    private String name;
    private String tagId;
    private String date;
    private String time;

    @JsonProperty("isCompleted") // ★ ADDED — same fix as OwnedCritterResponse;
    // this was very likely also silently serializing as "completed"
    private boolean isCompleted;
}