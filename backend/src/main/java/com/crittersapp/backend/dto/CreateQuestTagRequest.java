package com.crittersapp.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateQuestTagRequest {
    @NotBlank(message = "A name is required")
    private String name;

    @NotBlank(message = "A color is required")
    private String color;
}
