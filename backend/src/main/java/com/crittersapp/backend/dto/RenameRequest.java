package com.crittersapp.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RenameRequest {
    @NotBlank(message = "A name is required")
    private String name;
}