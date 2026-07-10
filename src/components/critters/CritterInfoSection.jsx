import { Stack, Box, Typography, Button } from "@mui/material";

export default function CritterInfoSection({ critter, onBack }) {
  return (
    <Stack spacing={2} sx={{ flex: 1, minHeight: 0, p: 2 }}>
      <Button onClick={onBack} sx={{ alignSelf: "flex-start", color: "var(--brown)" }}>
        ← Back
      </Button>
      <Typography variant="h3" sx={{ color: "var(--brown)" }}>
        {critter.name}
      </Typography>
      <Typography variant="body1" sx={{ color: "var(--brown)" }}>
        Lv. {critter.level}
      </Typography>
      {/* add more critter details here as needed */}
    </Stack>
  );
}