package com.crittersapp.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "critter_species")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CritterSpecies {
    @Id
    private String id;
    private String name;
    private String rarity;
}
