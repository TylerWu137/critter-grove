// src/data/users.js
//
// The root entity everything else hangs off of via userId foreign keys.
//
// ⚠️ DEV-ONLY: `password` is stored in plaintext here purely so the dummy
// AuthContext has something to check against locally. This is NOT how real
// auth works — a real backend would store a salted+hashed password (e.g.
// via bcrypt) and this field would never exist on the frontend at all, let
// alone in a plain JS file. Replace this entire login mechanism with a real
// API call before this app handles any real user data.

export const users = [
  {
    id: 1,
    email: "alex@example.com",
    password: "password123",
  },
  {
    id: 2,
    email: "sam@example.com",
    password: "password123",
  },
];