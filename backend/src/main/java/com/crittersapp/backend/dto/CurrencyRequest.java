package com.crittersapp.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CurrencyRequest {
    @NotBlank(message = "currencyKey is required")
    private String currencyKey; // "acorns" | "treats" | "flowers"

    @Positive(message = "Amount must be positive")
    private int amount;
}