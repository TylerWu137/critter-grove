package com.crittersapp.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// NOTE: not a @Document yet — this is a plain object held in-memory by
// ProfileRepository. When MongoDB Atlas is wired up, this class becomes a
// @Document(collection = "profiles") with @Id on userId — userId doubles as
// this document's own identifier since profiles are strictly 1:1 with
// users, so there's no need for a separate internal id field.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profile {
    private String userId; // also serves as this document's id — links back to User.id
    private String name;
    private int level;
    private int xp;
    private long acorns;
    private long treats;
    private long flowers;
}