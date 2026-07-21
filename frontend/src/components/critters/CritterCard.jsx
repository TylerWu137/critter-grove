import { Stack, Box, Typography } from "@mui/material";
import { useRef } from "react";

export default function CritterCard({ sx, name, level, onClick }) {
  const pointerDownPos = useRef(null);

  const handlePointerDown = (e) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e) => {
    if (!pointerDownPos.current) return;
    const dx = Math.abs(e.clientX - pointerDownPos.current.x);
    const dy = Math.abs(e.clientY - pointerDownPos.current.y);
    pointerDownPos.current = null;
    if (dx < 5 && dy < 5) {
      onClick?.();
    }
  };

  return (
    <Stack
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      sx={{
        alignItems: "center",
        px: 3, py: 1,
        width: "fit-content",
        mx: "auto",
        borderRadius: 4,
        "&:hover": { backgroundColor: "var(--highlight)" },
        ...sx,
      }}
    >
      <Box sx={{ height: "75px", width: "75px", border: 1 }}>image</Box>
      <Typography variant="h4" sx={{ color: "var(--brown)" }}>{name}</Typography>
      <Typography variant="body3" sx={{ color: "var(--brown)" }}>Lv. {level}</Typography>
    </Stack>
  );
}