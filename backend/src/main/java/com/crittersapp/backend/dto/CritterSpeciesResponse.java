package com.crittersapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CritterSpeciesResponse {
    private String id;
    private String name;
    private String rarity;
}
