package com.crittersapp.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SwapCompanionRequest {
    @NotBlank(message = "companionId is required")
    private String companionId; // the currently-companion critter being swapped out
}
