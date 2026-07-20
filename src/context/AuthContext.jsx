import { createContext, useContext, useState } from "react";

import { users as initialUsers } from "../data/users";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // users is now state (not a static import used directly) — signup needs
  // to be able to grow this list at runtime, same pattern as questTags
  // becoming state once addTag existed
  const [users, setUsers] = useState(initialUsers);

  // starts logged out; null means "no one is logged in"
  const [currentUserId, setCurrentUserId] = useState(null);

  const currentUser = currentUserId
    ? users.find((u) => u.id === currentUserId) ?? null
    : null;

  const isLoggedIn = currentUserId !== null;

  // ⚠️ DUMMY implementation — plaintext comparison against local data.
  // Replace with a real API call once a backend exists; a real version
  // should never compare plaintext passwords client-side at all.
  // Returns true/false so the caller (LoginScreen) can show an error.
  const login = (email, password) => {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return false;
    setCurrentUserId(user.id);
    return true;
  };

  // ⚠️ DUMMY implementation — same caveats as login: plaintext password,
  // no backend, no persistence past a page refresh. Returns an object
  // instead of a bare boolean so SignUpScreen can show *why* it failed
  // (e.g. "that email's taken") rather than a generic error.
  const signup = (email, username, password) => {
    const emailTaken = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (emailTaken) {
      return { success: false, error: "An account with that email already exists." };
    }

    const newUser = {
      id: Math.max(0, ...users.map((u) => u.id)) + 1, // mirrors addQuest/addTag's id-generation pattern
      email,
      username,
      password,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    return { success: true };
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const value = {
    currentUserId,
    currentUser,
    isLoggedIn,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}