// src/data/profiles.js
//
// One row per user (1:1 with users.js) -- all per-user GAME data lives
// here: display name, level/xp progression, and currency balances.
// These are combined into one table/context because they're almost
// always read and updated together (most reward-granting actions --
// rescuing a critter, finishing a quest, buying an item -- touch xp
// AND currency in the same action).
//
// `users.js` stays separate: email/auth concerns have a different
// lifecycle than game data, and may eventually be replaced entirely by
// an external auth provider (Firebase Auth, Supabase Auth, etc.) rather
// than a table you manage yourself.

export const profiles = [
  {
    id: 1,
    userId: 1,
    name: "Little Dragon",
    level: 18,
    xp: 80,
    acorns: 125,
    treats: 27232293,
    flowers: 8,
  },
  {
    id: 2,
    userId: 2,
    name: "Sunny Meadow",
    level: 5,
    xp: 20,
    acorns: 10,
    treats: 500,
    flowers: 0,
  },
];