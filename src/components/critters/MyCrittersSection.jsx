import {Grid, TextField, Stack} from "@mui/material";
import { useState } from "react";

import CritterCard from "./CritterCard"
import { userCompanions } from "../../data/companions";
import { userCritters } from "../../data/critters";

export default function MyCompanionsSection({  }) {
  const [search, setSearch] = useState("");

  const availableCritters = userCritters.filter(
    critter =>
      !userCompanions.some(
        companion => companion.id === critter.id
      )
  );
  const filteredCritters = availableCritters.filter((critter) =>
    critter.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack sx={{flex: 1, minHeight: 0, overflow: "hidden"}}>
      <TextField placeholder="Search Critters..." value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          width: "60%", 
          
          transform: "scale(0.8)",
          transformOrigin: "left center",
        }}
      />
      <Grid container columnSpacing={0} rowSpacing={-1} sx={{flex: 1, minHeight: 0, overflowY: "auto",
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
      }}>
        {filteredCritters.map((critter) => (
          <Grid size={2.4}>
            <CritterCard sx={{transform: "scale(0.8)", transformOrigin: "left center"}} name={critter.name} level={critter.level} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}