package com.crittersapp.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// NOTE: not a @Document yet — plain in-memory object. When MongoDB is
// wired up: @Document(collection = "quests"), @Id on id.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quest {
    private String id;
    private String userId;
    private String type;     // "daily" | "epic" | "side"
    private String tagId;    // nullable
    private String name;
    private String date;     // nullable, "YYYY-MM-DD"
    private String time;     // nullable, "HH:mm"
    private boolean isCompleted;
}
