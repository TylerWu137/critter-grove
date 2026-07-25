package com.crittersapp.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateQuestRequest {
    @NotBlank(message = "Type is required")
    private String type; // "daily" | "epic" | "side"

    @NotBlank(message = "A description is required")
    private String name;

    private String tagId; // nullable
    private String date;  // nullable
    private String time;  // nullable
}
