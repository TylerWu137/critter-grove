package com.crittersapp.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

// excludes UserDetailsServiceAutoConfiguration — this app authenticates via
// a custom JWT flow (AuthService + JwtAuthFilter), not Spring Security's
// built-in UserDetailsService/form-login mechanism, so that auto-config's
// fallback (a single generated user with a random password, logged on
// every startup) is unused dead weight. Excluding it removes the
// "Using generated security password" warning entirely, rather than just
// ignoring it.
@SpringBootApplication(exclude = { UserDetailsServiceAutoConfiguration.class })
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}