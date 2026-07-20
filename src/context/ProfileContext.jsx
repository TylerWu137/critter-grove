import { createContext, useContext, useState, useEffect } from "react";

import { users } from "../data/users";
import { profiles } from "../data/profiles";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext(null);

// builds the profile for a given user id — merges the matching
// users.js + profiles.js rows, same as before. NEW: falls back to a
// default starter profile if no profiles.js row exists yet (this
// happens for any user created via signup, since profiles.js is static
// dummy data and can't grow at runtime the way users.js/quests.js do).
function buildProfileFor(userId) {
  if (!userId) return null;

  const user = users.find((u) => u.id === userId);
  if (!user) return null;

  const profileData = profiles.find((p) => p.userId === userId);

  if (!profileData) {
    // ⚠️ ASSUMPTION — I don't have profiles.js's actual shape, so this is
    // a best-guess default (level 1, 0 xp/currency) for brand-new signups.
    // Adjust the starting values here if profiles.js's real defaults differ.
    return {
      userId: user.id,
      email: user.email,
      profileId: null,
      name: user.username ?? user.email,
      level: 1,
      xp: 0,
      acorns: 0,
      treats: 0,
      flowers: 0,
    };
  }

  return {
    userId: user.id,
    email: user.email,
    profileId: profileData.id,
    name: profileData.name,
    level: profileData.level,
    xp: profileData.xp,
    acorns: profileData.acorns,
    treats: profileData.treats,
    flowers: profileData.flowers,
  };
}

export function ProfileProvider({ children }) {
  const { currentUserId } = useAuth(); // ★ CHANGED — was a hardcoded CURRENT_USER_ID = 1

  const [profile, setProfile] = useState(() => buildProfileFor(currentUserId));

  // ★ ADDED — rebuilds the profile whenever the logged-in user changes
  // (login, logout, or switching accounts), so a new session never shows
  // the previous user's stale profile data
  useEffect(() => {
    setProfile(buildProfileFor(currentUserId));
  }, [currentUserId]);

  const renameProfile = (newName) => {
    setProfile((prev) => ({ ...prev, name: newName }));
  };

  // add xp, cascading level-ups whenever xp exceeds level*10
  const addXp = (amount) => {
    setProfile((prev) => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      while (newXp > newLevel * 10) {
        newXp -= newLevel * 10;
        newLevel++;
      }
      return { ...prev, xp: newXp, level: newLevel };
    });
  };

  // earn currency -- currencyKey is "acorns" | "treats" | "flowers"
  const earnCurrency = (currencyKey, amount) => {
    setProfile((prev) => ({ ...prev, [currencyKey]: prev[currencyKey] + amount }));
  };

  // spend currency -- returns false (and does nothing) if funds are insufficient,
  // so callers can guard the rest of an action on the result
  const spendCurrency = (currencyKey, amount) => {
    if (profile[currencyKey] < amount) return false;
    setProfile((prev) => ({ ...prev, [currencyKey]: prev[currencyKey] - amount }));
    return true;
  };

  // one atomic update for actions that grant both xp and currency at once
  const grantReward = ({ xp = 0, acorns = 0, treats = 0, flowers = 0 } = {}) => {
    setProfile((prev) => {
      let newXp = prev.xp + xp;
      let newLevel = prev.level;
      while (newXp > newLevel * 10) {
        newXp -= newLevel * 10;
        newLevel++;
      }
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        acorns: prev.acorns + acorns,
        treats: prev.treats + treats,
        flowers: prev.flowers + flowers,
      };
    });
  };

  const value = {
    profile,
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