package com.crittersapp.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// userId is nullable: null = a default/global tag visible to everyone
// (school, family, art, nutrition), non-null = a tag a specific user
// created themselves via the "Add new tag" UI, visible only to them.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestTag {
    private String id;
    private String userId; // nullable — see note above
    private String name;
    private String color;  // hex string, e.g. "#a3f9c2"
}
