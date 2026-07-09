import {Stack, Box, Button, Typography} from "@mui/material";

export default function CrittersMenuView({ view, setView }) {
  return (
    <>
      <Box sx={{flex: 0 }}/>
      <Stack spacing={4} sx={{width: "100%", alignItems: "center"}}>
        <Box sx={{height: "200px", width: "50%", border: 1}}/>
        <Typography variant="body1">Vestibulum elementum, nibh nec tristique ullamcorper, magna sem ultrices tortor, id accumsan eros dui eu purus. Aliquam nisl lacus, sagittis sit amet augue in, tincidunt accumsa</Typography>
        <Button variant="menu" sx={{width: "40%"}}
          onClick={() => setView("companions")}
        ><Typography variant="h3">Companions</Typography></Button>
        <Button variant="menu" sx={{width: "40%"}}
          onClick={() => setView("critterdex")}
        ><Typography variant="h3">CritterDex</Typography></Button>
      </Stack>
  </>
  )
};
  