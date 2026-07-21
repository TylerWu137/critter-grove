import { Stack, Typography } from "@mui/material";
import ConstructionIcon from '@mui/icons-material/Construction';

export default function InProgressPlaceholder({ label, sx }) {
  return (
    <Stack
      spacing={1}
      sx={{
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        border: "2px dashed var(--light-brown)",
        backgroundColor: "var(--cream)",
        borderRadius: 3,
        boxSizing: "border-box",
        opacity: 0.8,
        ...sx,
      }}
    >
      <ConstructionIcon
        sx={{
          fontSize: 32,
          color: "var(--light-brown)",
          // ★ a small playful wobble, not a full spin — keeps it cute
          // rather than looking like a loading spinner
          animation: "wobble 2.4s ease-in-out infinite",
          "@keyframes wobble": {
            "0%, 100%": { transform: "rotate(-8deg)" },
            "50%": { transform: "rotate(8deg)" },
          },
        }}
      />
      <Typography variant="h4" sx={{ color: "var(--brown)" }}>
        {label ? `${label} — coming soon!` : "Coming soon!"}
      </Typography>
      <Typography variant="text" sx={{ color: "var(--light-brown)", textAlign: "center" }}>
        This section is under construction. Check back later!
      </Typography>
    </Stack>
  );
}