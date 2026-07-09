import {Stack, Box, Grid, Typography} from "@mui/material";

export default function CritterCard({ sx, name, level }) {
  return (
    <Stack sx={{alignItems: "center", ...sx}}>
      <Box sx={{height: "80px", width: "80px", border: 1}}>image</Box>
      <Typography variant="h4" sx={{color: "var(--brown)"}}>{name}</Typography>
      <Typography variant="body2" sx={{color: "var(--brown)"}}>Lv. {level}</Typography>
    </Stack>
  );
}