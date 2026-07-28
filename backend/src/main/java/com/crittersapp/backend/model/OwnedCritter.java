package com.crittersapp.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "owned_critters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OwnedCritter {
    @Id
    private String id;
    private String userId;
    private String speciesId;
    private int level;
    private int xp;
    private boolean isCompanion;
}
