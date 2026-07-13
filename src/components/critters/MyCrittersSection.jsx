import { Grid, TextField, Stack } from "@mui/material";
import { useState } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

import { useCritters } from "./CrittersContext";
import DraggableCritterCard from "./DraggableCritterCard";

export default function MyCrittersSection() {
  const { critters, getCritterName } = useCritters();
  const [search, setSearch] = useState("");

  const filteredCritters = critters.filter((critter) =>
    getCritterName(critter).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack spacing={1} sx={{ flex: 1, minHeight: 0, overflow: "hidden", px: 1 }}>
      <TextField
        placeholder="Search Critters..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ width: "60%", transform: "scale(0.8)", transformOrigin: "left center" }}
      />
      <SortableContext items={filteredCritters.map((c) => c.id)} strategy={rectSortingStrategy}>
        <Grid
          container
          columnSpacing={0}
          rowSpacing={0}
          sx={{ flex: 1, minHeight: 0, overflowY: "scroll",
            "&::-webkit-scrollbar": {
              width: 10,
              borderColor: "var(--brown)",
              borderWidth: 100,
            },

            "&::-webkit-scrollbar-track": {
              backgroundColor: "var(--cream)",
              border: "2px solid var(--brown)",
              borderRadius: "999px",
              borderRadius: "999px",
            },

            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "var(--red)",
              border: "2px solid transparent",
              backgroundClip: "padding-box",
              borderRadius: "999px",
            },
           }}
        >
          {filteredCritters.map((critter) => (
            <Grid size={2.4} key={critter.id} sx={{ zoom: 0.8 }}>
              <DraggableCritterCard id={critter.id} />
            </Grid>
          ))}
        </Grid>
      </SortableContext>
    </Stack>
  );
}