package com.crittersapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuestTagResponse {
    private String id;
    private String name;
    private String color;
}
