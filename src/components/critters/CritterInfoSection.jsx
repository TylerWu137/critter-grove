import { Stack, Typography, Button } from "@mui/material";

import { useCritters } from "./CrittersContext";

export default function CritterInfoSection() {
  const { selectedCritter, setSelectedCritter } = useCritters();

  if (!selectedCritter) return null;

  return (
    <Stack spacing={2} sx={{ flex: 1, minHeight: 0, p: 2 }}>
      <Button onClick={() => setSelectedCritter(null)} sx={{ alignSelf: "flex-start", color: "var(--brown)" }}>
        ← Back
      </Button>
      <Typography variant="h3" sx={{ color: "var(--brown)" }}>
        {selectedCritter.name}
      </Typography>
      <Typography variant="body1" sx={{ color: "var(--brown)" }}>
        Lv. {selectedCritter.level}
      </Typography>
      {/* add more critter details here as needed */}
    </Stack>
  );
}