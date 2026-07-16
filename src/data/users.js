// src/data/users.js
//
// The root entity everything else hangs off of via userId foreign keys.
// In a real backend this is your auth/accounts table -- passwordHash would
// live here too, but is never sent to or read by the frontend directly;
// the frontend only ever holds a logged-in userId (or session token).

export const users = [
  {
    id: 1,
    email: "alex@example.com",
  },
  {
    id: 2,
    email: "sam@example.com",
  },
];