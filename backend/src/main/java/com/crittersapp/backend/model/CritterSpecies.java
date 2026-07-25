package com.crittersapp.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Global/shared catalog data — NOT owned by any user, same reasoning as
// your frontend's critterSpecies.js. No userId field.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CritterSpecies {
    private String id;
    private String name;
    private String rarity;
}
