package com.crittersapp.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "quest_tags")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestTag {
    @Id
    private String id;
    private String userId; // nullable — null = global/default tag
    private String name;
    private String color;
}
