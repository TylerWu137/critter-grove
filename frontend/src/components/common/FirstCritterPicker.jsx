import { useState, useEffect } from "react";
import { Stack, Box } from "@mui/material";

import ArtworkPlaceholder from "./ArtworkPlaceholder";
import CritterSelectBox from "./CritterSelectBox";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// controlled component — SignUpScreen owns the selected value, this just
// fetches the options and renders the picker UI
export default function FirstCritterPicker({ selectedSpeciesId, onSelect }) {
  const [species, setSpecies] = useState([]);

  useEffect(() => {
    // no Authorization header — this endpoint is public specifically so
    // an unauthenticated visitor can use this picker before signing up
    fetch(`${API_BASE_URL}/api/critters/species`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setSpecies(data.slice(0, 5)))
      .catch(() => setSpecies([]));
  }, []);

  return (
    <Stack spacing={2} sx={{ flex: 1, width: "100%" }}>
      <ArtworkPlaceholder sx={{ flex: 1, width: "100%" }} />
      <Stack direction="row" spacing={1.5} sx={{ width: "100%" }}>
        {species.map((s) => (
          <CritterSelectBox
            key={s.id}
            selected={selectedSpeciesId === s.id}
            onClick={() => onSelect(s.id)}
          />
        ))}
      </Stack>
    </Stack>
  );
}