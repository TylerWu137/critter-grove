import { createContext, useContext, useState } from "react";

import { users } from "../data/users";
import { profiles } from "../data/profiles";

const ProfileContext = createContext(null);

// placeholder until real auth exists -- swap this for a value from
// AuthContext (or a session/token lookup) once login is implemented
const CURRENT_USER_ID = 1;

// merges the matching users.js + profiles.js rows for the current user
function buildInitialProfile() {
  const user = users.find((u) => u.id === CURRENT_USER_ID);
  const profileData = profiles.find((p) => p.userId === CURRENT_USER_ID);

  if (!user || !profileData) return null;

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
  const [profile, setProfile] = useState(buildInitialProfile);

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

  // ★ the key piece for your coupling concern — one atomic update for
  // actions that grant both xp and currency at once (rescuing a critter,
  // completing a quest, etc), instead of calling addXp + earnCurrency
  // separately and risking a half-applied update
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