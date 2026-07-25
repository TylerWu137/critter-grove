package com.crittersapp.backend.dto;

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
    private boolean isCompleted;
}
