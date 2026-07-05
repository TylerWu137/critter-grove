import {Stack, Box, Collapse, Button, Typography} from "@mui/material";
import { useState } from "react";

export default function NavBar({sx}) {
  const [open, setOpen] = useState(false);

  const NavButton = (section) => (
    <Button
      variant="menu2"
      sx={{height:"100%"}}
    >
      <Typography variant="h4">{section}</Typography>
    </Button>
  );

  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <Box sx={{flex:1}}/>
      <Collapse orientation="horizontal" in={open}>
        <Stack spacing={2} direction="row" alignItems="center" sx={{height:"100%"}}>
          {NavButton("\u2009Critters\u2009")}
          {NavButton("\u2009\u2009\u2009Shop\u2009\u2009\u2009")}
          {NavButton("\u2009Settings\u2009")}
        </Stack>
      </Collapse>

      <Button variant="menu" onClick={() => setOpen(!open)}>
        <Typography variant="h3">Menu</Typography>
      </Button>

      <Collapse orientation="horizontal" in={open} >
        <Stack spacing={2} direction="row" sx={{height:"100%"}}>
          {NavButton("\u2009Quests\u2009")}
          {NavButton("Calendar")}
          {NavButton("Journal")}
        </Stack>
      </Collapse>
      <Box sx={{flex:1}}/>
    </Stack>
  )
};