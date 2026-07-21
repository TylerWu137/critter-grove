package com.crittersapp.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// NOTE: not a JPA @Entity yet — this is a plain object held in-memory by
// UserRepository. When the real database is added, this class becomes an
// @Entity with @Id/@GeneratedValue on id, and everything else (service
// layer, controller, DTOs) stays the same.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    private String email;
    private String passwordHash; // bcrypt hash — never the raw password
}
