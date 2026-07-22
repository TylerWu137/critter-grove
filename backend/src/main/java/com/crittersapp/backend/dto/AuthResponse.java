package com.crittersapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

// what the frontend's AuthContext will store: the token (send it back on
// every subsequent request) plus the basic user info it already expects
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String userId;
    private String email;
}
