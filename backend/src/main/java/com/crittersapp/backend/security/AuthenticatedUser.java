package com.crittersapp.backend.security;

import org.springframework.security.core.context.SecurityContextHolder;

// Convenience accessor for "who is making this request" — JwtAuthFilter
// stores the userId as the authentication principal; this just reads it
// back out cleanly wherever a controller/service needs it.
public class AuthenticatedUser {

    public static String getCurrentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof String)) {
            return null;
        }
        return (String) auth.getPrincipal();
    }
}
