import { Box, Grid } from "@mui/material";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

import { useCritters } from "./CrittersContext";
import SortableCritterCard from "./SortableCritterCard";
import EmptyCompanionSlot from "./EmptyCompanionSlot";

export default function MyCompanionsSection() {
  const { companions, pickingCompanion, maxCompanions } = useCritters();
  const emptySlotCount = maxCompanions - companions.length;

  return (
    <Box
    sx={{
      position: "relative",
      zIndex: pickingCompanion ? 1301 : "auto",
      borderRadius: 4,
      p: pickingCompanion ? 1 : 0,
      transition: "box-shadow 0.2s, background-color 0.2s",
      ...(pickingCompanion && {
        backgroundColor: "var(--cream)",
        boxShadow: "0 0 0 4px var(--yellow)",
      }),
    }}
  >
    <SortableContext items={companions.map((c) => c.id)} strategy={rectSortingStrategy}>
      <Grid container columnSpacing={0} rowSpacing={1}>
        {companions.map((critter) => (
          <Grid size={4} key={critter.id}>
            <SortableCritterCard id={critter.id} />
          </Grid>
        ))}
        {Array.from({ length: emptySlotCount }).map((_, i) => (
          <Grid size={4} key={`empty-slot-${i}`}>
            <EmptyCompanionSlot index={i} />
          </Grid>
        ))}
      </Grid>
    </SortableContext>
  </Box>
  );
}