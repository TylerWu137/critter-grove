package com.crittersapp.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateQuestRequest {
    @NotBlank(message = "Type is required")
    private String type;

    @NotBlank(message = "A description is required")
    private String name;

    private String tagId;
    private String date;
    private String time;
}
