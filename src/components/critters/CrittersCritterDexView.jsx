import { Grid, TextField, Stack } from "@mui/material";
import { useState } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

import { critterSpecies } from "../../data/critterSpecies";

import { useCritters } from "./CrittersContext";
import CritterCard from "./CritterCard";

export default function CrittersCritterDexView() {
  const { ownedCritters, viewCritterFullInfo } = useCritters();
  const [search, setSearch] = useState("");

  const filteredCritters = critterSpecies.filter((critter) =>
    critter.name.toLowerCase().includes(search.toLowerCase())
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
          {critterSpecies.map((species) => {
            const owned = ownedCritters.find((c) => c.id === species.id);
    
            return (
              <Grid size={2.4} key={species.id} sx={{ zoom: 0.8 }}>
                <CritterCard
                  name={owned ? species.name : "???"}
                  level={owned ? owned.level : "?"}
                  onClick={owned ? () => viewCritterFullInfo(owned) : undefined}
                  sx={{
                    opacity: owned ? 1 : 0.4,
                    cursor: owned ? "pointer" : "default",
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      </SortableContext>
    </Stack>
  );
}