package com.crittersapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

// what the frontend's ProfileContext will store
@Data
@AllArgsConstructor
public class ProfileResponse {
    private String userId;
    private String name;
    private int level;
    private int xp;
    private long acorns;
    private long treats;
    private long flowers;
}