import { Grid } from "@mui/material";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

import { useCritters } from "./CrittersContext";
import SortableCritterCard from "./SortableCritterCard";

export default function MyCompanionsSection() {
  const { companions } = useCritters();

  return (
    <SortableContext items={companions.map((c) => c.id)} strategy={rectSortingStrategy}>
      <Grid container columnSpacing={0} rowSpacing={1}>
        {companions.map((critter) => (
          <Grid size={4} key={critter.id}>
            <SortableCritterCard id={critter.id} />
          </Grid>
        ))}
      </Grid>
    </SortableContext>
  );
}