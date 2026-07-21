import { useDroppable } from "@dnd-kit/core";
import { Stack, Typography } from "@mui/material";

import { useCritters } from "./CrittersContext";

export default function EmptyCompanionSlot({ index }) {
  const { pickingCompanion, addToCompanions } = useCritters();
  const { setNodeRef, isOver } = useDroppable({ id: `empty-slot-${index}` });

  const handleClick = () => {
    if (pickingCompanion) {
      addToCompanions();
    }
  };

  return (
    <Stack
      ref={setNodeRef}
      onClick={handleClick}
      sx={{
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: 1,
        minHeight: "100px",
        width: "fit-content",
        mx: "auto",
        borderRadius: 4,
        border: "2px dashed var(--light-brown)",
        cursor: pickingCompanion ? "pointer" : "default",
        // light up while something is dragged over it, or on hover during pick mode
        backgroundColor: isOver ? "var(--highlight)" : "transparent",
        "&:hover": {
          backgroundColor: pickingCompanion ? "var(--highlight)" : "transparent",
        },
      }}
    >
      <Typography variant="body2" sx={{ color: "var(--light-brown)" }}>
        Empty
      </Typography>
    </Stack>
  );
}