import { createContext, useContext, useState } from "react";

import { users as initialUsers } from "../data/users";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ★ CHANGED — users is now state, not a static import, so signUp can add to it
  const [users, setUsers] = useState(initialUsers);

  // starts logged out; null means "no one is logged in"
  const [currentUserId, setCurrentUserId] = useState(null);

  const currentUser = currentUserId
    ? users.find((u) => u.id === currentUserId) ?? null
    : null;

  const isLoggedIn = currentUserId !== null;

  const isEmailTaken = (email) => // ★ ADDED
    users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  // ⚠️ DUMMY implementation — plaintext comparison against local data.
  // Replace with a real API call once a backend exists.
  const login = (email, password) => {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!user) return false;
    setCurrentUserId(user.id);
    return true;
  };

  // ★ ADDED — creates a new user and logs them in immediately.
  // Returns { success, userId } or { success: false, error }.
  const signUp = (email, password) => {
    if (!email.trim() || !password) {
      return { success: false, error: "Email and password are required." };
    }
    if (isEmailTaken(email)) {
      return { success: false, error: "That email is already registered." };
    }

    const newUser = {
      id: Math.max(0, ...users.map((u) => u.id)) + 1,
      email: email.trim(),
      password, // ⚠️ dummy plaintext — see users.js caveat
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id); // auto-login after sign up
    return { success: true, userId: newUser.id };
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const value = {
    currentUserId,
    currentUser,
    isLoggedIn,
    isEmailTaken,
    login,
    signUp,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}