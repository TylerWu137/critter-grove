package com.crittersapp.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profile {
    @Id
    private String userId; // still doubles as this document's id, unchanged from before
    private String name;
    private int level;
    private int xp;
    private long acorns;
    private long treats;
    private long flowers;
}
