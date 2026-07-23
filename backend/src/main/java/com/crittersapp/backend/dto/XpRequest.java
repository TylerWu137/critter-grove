package com.crittersapp.backend.dto;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class XpRequest {
    @PositiveOrZero(message = "Amount cannot be negative")
    private int amount;
}