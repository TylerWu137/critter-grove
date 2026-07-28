package com.crittersapp.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users") // ★ CHANGED — was just a plain in-memory object
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id // ★ ADDED — tells Spring Data this is the document's identifier
    private String id;
    private String email;
    private String passwordHash;
}
