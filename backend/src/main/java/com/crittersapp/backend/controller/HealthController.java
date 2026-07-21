package com.crittersapp.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    // hit this first from the frontend to confirm the deployed backend is
    // reachable and CORS is configured correctly, before testing anything
    // that touches auth/business logic
    @GetMapping("/api/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }
}
