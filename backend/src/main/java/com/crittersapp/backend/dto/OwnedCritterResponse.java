package com.crittersapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OwnedCritterResponse {
    private String id;
    private String speciesId;
    private int level;
    private int xp;
    private boolean isCompanion;
}
