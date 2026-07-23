import { createContext, useContext, useState, useEffect } from "react";

import { useAuth } from "./AuthContext";

const ProfileContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function ProfileProvider({ children }) {
  const { currentUserId, token, isLoading: authIsLoading } = useAuth(); // ★ CHANGED — added authIsLoading

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ★ CHANGED — added the authIsLoading guard at the top. Without it, this
  // effect ran immediately on mount while currentUserId was still its
  // default `null` (AuthContext hadn't finished checking the stored token
  // yet) — indistinguishable from "actually logged out," which caused
  // profile to be wrongly cleared to null on every page reload, crashing
  // any component reading profile.name before the real check finished.
  useEffect(() => {
    if (authIsLoading) return; // don't do anything until auth has resolved

    const fetchProfile = async () => {
      if (!currentUserId || !token) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setProfile(data);
      } catch {
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [currentUserId, token, authIsLoading]); // ★ CHANGED — added authIsLoading

  // ★ CHANGED — every mutation now calls the backend, then trusts the
  // response as the new state, rather than computing the new state itself
  // client-side. This is the same principle as the xp-cascade math: the
  // backend is the single source of truth for the math now, not a
  // duplicated copy of the same logic in two languages.

  const renameProfile = async (newName) => {
    const res = await fetch(`${API_BASE_URL}/api/profile/name`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({ name: newName }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.message };
    setProfile(data);
    return { success: true };
  };

  const addXp = async (amount) => {
    const res = await fetch(`${API_BASE_URL}/api/profile/xp`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ amount }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.message };
    setProfile(data);
    return { success: true };
  };

  const earnCurrency = async (currencyKey, amount) => {
    const res = await fetch(`${API_BASE_URL}/api/profile/currency/earn`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ currencyKey, amount }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.message };
    setProfile(data);
    return { success: true };
  };

  // NOTE: unlike the old local version, this can't check "enough funds?"
  // before calling the backend — the backend is the source of truth for
  // the current balance, so it does that check and returns an error
  // (InsufficientFundsException → 400) instead of the frontend guessing
  const spendCurrency = async (currencyKey, amount) => {
    const res = await fetch(`${API_BASE_URL}/api/profile/currency/spend`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ currencyKey, amount }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.message };
    setProfile(data);
    return { success: true };
  };

  // ★ REMOVED — grantReward, isNameTaken, createProfile. grantReward has no
  // backend endpoint yet (it's currently only callable server-side, JVM-to-
  // JVM, by AuthService during sign-up — see ProfileService.grantReward's
  // comment). isNameTaken/createProfile are gone because sign-up now
  // creates the profile automatically on the backend; add these back if a
  // future feature (e.g. quest/critter rewards) needs a dedicated
  // POST /api/profile/reward endpoint.

  const value = {
    profile,
    isLoading, // ★ ADDED
    renameProfile,
    addXp,
    earnCurrency,
    spendCurrency,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
  return ctx;
}