package com.crittersapp.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OwnedCritterResponse {
    private String id;
    private String speciesId;
    private int level;
    private int xp;

    @JsonProperty("isCompanion") // ★ ADDED — without this, Jackson's default
    // boolean-getter naming rule turns isCompanion() into JSON key
    // "companion" (strips "is", lowercases next letter), which silently
    // didn't match what the frontend expected
    private boolean isCompanion;
}