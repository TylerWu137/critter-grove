package com.crittersapp.backend.dto;

import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class FeedCritterRequest {
    @Positive(message = "Amount must be positive")
    private int amount;
}
