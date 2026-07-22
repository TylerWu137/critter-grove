package com.crittersapp.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// NOTE: not a @Document yet — this is a plain object held in-memory by
// UserRepository. When MongoDB Atlas is wired up, this class becomes a
// @Document(collection = "users") with @Id on id — everything else (service
// layer, controller, DTOs) stays the same. id is already a String to match
// MongoDB's native ObjectId shape, rather than an auto-incrementing number.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String id;
    private String email;
    private String passwordHash; // bcrypt hash — never the raw password
}
