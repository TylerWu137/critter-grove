import { createContext, useContext, useState } from "react";

import { users } from "../data/users";
import { profiles } from "../data/profiles";

const ProfileContext = createContext(null);

// placeholder until real auth exists -- swap this for a value from
// AuthContext (or a session/token lookup) once login is implemented
const CURRENT_USER_ID = 1;

// merges the matching users.js + profiles.js rows into a single object
// for the current user, since the UI treats "account info" and "game
// profile info" as one thing even though they're two separate tables
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
  };
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(buildInitialProfile);

  const renameProfile = (newName) => {
    setProfile((prev) => ({ ...prev, name: newName }));
  };

  // add xp, cascading level-ups the same way feedCritter does
  const addProfileXp = (amount) => {
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

  const value = {
    profile,
    renameProfile,
    addProfileXp,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
  return ctx;
}