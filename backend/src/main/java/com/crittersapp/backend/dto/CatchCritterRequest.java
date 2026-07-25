package com.crittersapp.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CatchCritterRequest {
    @NotBlank(message = "speciesId is required")
    private String speciesId;
}
