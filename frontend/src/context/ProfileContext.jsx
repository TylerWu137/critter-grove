import { createContext, useContext, useState } from "react";

import { profiles as initialProfiles } from "../data/profiles";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const { currentUserId, currentUser } = useAuth();

  // ★ CHANGED — profiles is the single source of truth (like ownedCritters
  // in CrittersContext); `profile` below is DERIVED from it each render,
  // not kept as separate state. This fixes a real bug the old version had:
  // renameProfile/addXp/etc only ever updated a standalone `profile` object,
  // never persisting back into a `profiles` list — so a rename would vanish
  // on next login, and sign-up's name-uniqueness check would never see it.
  const [profiles, setProfiles] = useState(initialProfiles);

  const profileData = currentUserId !== null
    ? profiles.find((p) => p.userId === currentUserId)
    : null;

  const profile = profileData && currentUser
    ? {
        userId: currentUser.id,
        email: currentUser.email,
        profileId: profileData.id,
        name: profileData.name,
        level: profileData.level,
        xp: profileData.xp,
        acorns: profileData.acorns,
        treats: profileData.treats,
        flowers: profileData.flowers,
      }
    : null;

  const isNameTaken = (name) => // ★ ADDED
    profiles.some((p) => p.name.trim().toLowerCase() === name.trim().toLowerCase());

  // ★ ADDED — creates a new profile row for a freshly signed-up user.
  // Returns { success: true } or { success: false, error }.
  const createProfile = (userId, name) => {
    if (!name.trim()) {
      return { success: false, error: "A name is required." };
    }
    if (isNameTaken(name)) {
      return { success: false, error: "That name is already taken." };
    }

    const newProfile = {
      id: Math.max(0, ...profiles.map((p) => p.id)) + 1,
      userId,
      name: name.trim(),
      level: 1,
      xp: 0,
      acorns: 0,
      treats: 0,
      flowers: 0,
    };
    setProfiles((prev) => [...prev, newProfile]);
    return { success: true };
  };

  const renameProfile = (newName) => {
    if (!profile) return;
    setProfiles((prev) =>
      prev.map((p) => (p.id === profile.profileId ? { ...p, name: newName } : p))
    );
  };

  // add xp, cascading level-ups whenever xp exceeds level*10
  const addXp = (amount) => {
    if (!profile) return;
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== profile.profileId) return p;
        let newXp = p.xp + amount;
        let newLevel = p.level;
        while (newXp > newLevel * 10) {
          newXp -= newLevel * 10;
          newLevel++;
        }
        return { ...p, xp: newXp, level: newLevel };
      })
    );
  };

  // earn currency -- currencyKey is "acorns" | "treats" | "flowers"
  const earnCurrency = (currencyKey, amount) => {
    if (!profile) return;
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profile.profileId ? { ...p, [currencyKey]: p[currencyKey] + amount } : p
      )
    );
  };

  // spend currency -- returns false (and does nothing) if funds are insufficient
  const spendCurrency = (currencyKey, amount) => {
    if (!profile) return false;
    if (profile[currencyKey] < amount) return false;
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profile.profileId ? { ...p, [currencyKey]: p[currencyKey] - amount } : p
      )
    );
    return true;
  };

  // one atomic update for actions that grant both xp and currency at once
  const grantReward = ({ xp = 0, acorns = 0, treats = 0, flowers = 0 } = {}) => {
    if (!profile) return;
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== profile.profileId) return p;
        let newXp = p.xp + xp;
        let newLevel = p.level;
        while (newXp > newLevel * 10) {
          newXp -= newLevel * 10;
          newLevel++;
        }
        return {
          ...p,
          xp: newXp,
          level: newLevel,
          acorns: p.acorns + acorns,
          treats: p.treats + treats,
          flowers: p.flowers + flowers,
        };
      })
    );
  };

  const value = {
    profile,
    isNameTaken,
    createProfile,
    renameProfile,
    addXp,
    earnCurrency,
    spendCurrency,
    grantReward,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
  return ctx;
}