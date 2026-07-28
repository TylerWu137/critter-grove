package com.crittersapp.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "quests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quest {
    @Id
    private String id;
    private String userId;
    private String type;
    private String tagId;
    private String name;
    private String date;
    private String time;
    private boolean isCompleted;
}
