import { Grid, TextField, Stack } from "@mui/material";
import { useState } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import DraggableCritterCard from "./DraggableCritterCard";

export default function MyCrittersSection({ critters, companions }) {
  const [search, setSearch] = useState("");

  const filteredCritters = critters.filter((critter) =>
    critter.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack spacing={1} sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
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
          sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}
        >
          {filteredCritters.map((critter) => (
            <Grid size={2.4} key={critter.id} sx={{ zoom: 0.8 }}>
              <DraggableCritterCard id={critter.id} name={critter.name} level={critter.level} />
            </Grid>
          ))}
        </Grid>
      </SortableContext>
    </Stack>
  );
}