// src/data/profiles.js
//
// One profile per user (1:1 with users.js). Replaces the old single
// `profile` object -- that shape only worked for exactly one user.
// `userId` links back to users.js.

export const profiles = [
  {
    id: 1,
    userId: 1,
    name: "Little Dragon",
    level: 18,
    xp: 80,
  },
  {
    id: 2,
    userId: 2,
    name: "Sunny Meadow",
    level: 5,
    xp: 20,
  },
];