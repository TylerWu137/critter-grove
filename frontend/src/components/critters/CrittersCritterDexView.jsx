import { Grid, TextField, Stack } from "@mui/material";
import { useState } from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

import { useCritters } from "./CrittersContext";
import CritterCard from "./CritterCard";

export default function CrittersCritterDexView() {
  // ★ CHANGED — critterSpecies now comes from context (fetched from the
  // backend), not the old static data file — its ids are real backend
  // UUIDs now, which is what ownedCritters.speciesId actually references
  const { ownedCritters, critterSpecies, viewCritterFullInfo } = useCritters();
  const [search, setSearch] = useState("");

  const filteredSpecies = critterSpecies.filter((species) =>
    species.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack spacing={1} sx={{ flex: 1, minHeight: 0, overflow: "hidden", px: 1 }}>
      <TextField
        placeholder="Search Critters..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ width: "60%", transform: "scale(0.8)", transformOrigin: "left center" }}
      />
      <SortableContext items={filteredSpecies.map((s) => s.id)} strategy={rectSortingStrategy}>
        <Grid
          container
          columnSpacing={0}
          rowSpacing={0}
          sx={{
            flex: 1, minHeight: 0, overflowY: "scroll",
            alignItems: "flex-start", // aligns items within each row to the top
            alignContent: "flex-start", // ★ ADDED — stops rows themselves from stretching apart to fill leftover vertical space when there are few critters/rows
            "&::-webkit-scrollbar": {
              width: 10,
              borderColor: "var(--brown)",
              borderWidth: 100,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "var(--cream)",
              border: "2px solid var(--brown)",
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
          {filteredSpecies.map((species) => {
            const owned = ownedCritters.find((c) => c.speciesId === species.id);

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