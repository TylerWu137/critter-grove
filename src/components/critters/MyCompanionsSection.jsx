import {Grid} from "@mui/material";
import CritterCard from "./CritterCard"
import { userCompanions } from "../../data/companions";

export default function MyCompanionsSection({  }) {
  return (
   <Grid container columnSpacing={0} rowSpacing={3}>
      {userCompanions.map((critter) => (
        <Grid size={4}>
          <CritterCard name={critter.name} level={critter.level} />
        </Grid>
      ))}
    </Grid>
  );
}