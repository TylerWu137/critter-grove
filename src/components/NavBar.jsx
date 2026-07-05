import {Stack, Box, Collapse, Button, Typography} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const NavButton = (section, path) => (
    <Button
      variant="menu2"
      sx={{height:"100%"}}
      onClick={() => navigate(path)}
    >
      <Typography variant="h4">{section}</Typography>
    </Button>
  );

  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <Box sx={{flex:1}}/>
      <Collapse orientation="horizontal" in={open}>
        <Stack spacing={2} direction="row" alignItems="center" sx={{height:"100%"}}>
          {NavButton("\u2009Critters\u2009", "/critters")}
          {NavButton("\u2009\u2009\u2009Shop\u2009\u2009\u2009", "/shop")}
          {NavButton("\u2009Settings\u2009", "/settings")}
        </Stack>
      </Collapse>

      <Button variant="menu" onClick={() => setOpen(!open)}>
        <Typography variant="h3">Menu</Typography>
      </Button>

      <Collapse orientation="horizontal" in={open} >
        <Stack spacing={2} direction="row" sx={{height:"100%"}}>
          {NavButton("\u2009Quests\u2009", "/quests")}
          {NavButton("Calendar", "/calendar")}
          {NavButton("Journal", "/journal")}
        </Stack>
      </Collapse>
      <Box sx={{flex:1}}/>
    </Stack>
  )
};