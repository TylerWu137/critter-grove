package com.crittersapp.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OwnedCritter {
    private String id;
    private String userId;
    private String speciesId;
    private int level;
    private int xp;
    private boolean isCompanion;
}
