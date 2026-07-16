import { Stack, Box, Typography } from "@mui/material";

import { useProfile } from "../../context/ProfileContext";

import UserProfile from "./UserProfile"
import Currencies from "./Currencies"

export default function PlayerTopBar({ sx, activePanel }) {

  const { profile } = useProfile();

  return (
    <Stack direction="row" sx={sx}>
         <UserProfile
            name={profile.name}
            currentXp={profile.xp}
            level={profile.level}
          />
          <Box sx={{ flex: 1 }} />
          <Currencies
            acorns = {profile.acorns}
            treats = {profile.treats}
            flowers = {profile.flowers}
            activePanel={activePanel}
          />
    </Stack>
  );
}