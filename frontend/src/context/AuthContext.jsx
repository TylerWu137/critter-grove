import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TOKEN_STORAGE_KEY = "authToken";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  // ★ ADDED — true while we're checking a stored token on first load.
  // Without this, ProtectedRoute would see isLoggedIn=false and redirect
  // to /login for a split second even when the user actually has a valid
  // stored session, before the /me check has had a chance to confirm it.
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = currentUserId !== null;
  const currentUser = isLoggedIn ? { id: currentUserId, email: currentUserEmail } : null;

  // ★ ADDED — on mount, if a token is already stored (from a previous
  // session), verify it's still valid and restore login state. Runs once.
  useEffect(() => {
    const rehydrateSession = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Stored token is no longer valid");

        const data = await res.json();
        setCurrentUserId(data.userId);
        setCurrentUserEmail(data.email);
      } catch {
        // token expired, or backend unreachable — clear the stale session
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    rehydrateSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only ever run once, on mount

  // ★ CHANGED — was a synchronous local-array check; now hits the real API.
  // Returns { success: true } or { success: false, error }.
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.message || "Login failed." };
      }

      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      setToken(data.token);
      setCurrentUserId(data.userId);
      setCurrentUserEmail(data.email);
      return { success: true };
    } catch {
      return { success: false, error: "Could not reach the server. Please try again." };
    }
  };

  // ★ CHANGED — now takes `name` too. The backend's /api/auth/signup
  // creates BOTH the user and their profile in one call (with rollback if
  // the name is taken — see AuthService.signUp), so the frontend no longer
  // makes a separate "create profile" call after this succeeds.
  const signUp = async (email, password, name) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.message || "Sign up failed." };
      }

      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      setToken(data.token);
      setCurrentUserId(data.userId);
      setCurrentUserEmail(data.email);
      return { success: true, userId: data.userId };
    } catch {
      return { success: false, error: "Could not reach the server. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setCurrentUserId(null);
    setCurrentUserEmail(null);
  };

  const value = {
    currentUserId,
    currentUser,
    token, // ★ ADDED — exposed so other contexts can attach it to their own future fetch calls
    isLoggedIn,
    isLoading, // ★ ADDED
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