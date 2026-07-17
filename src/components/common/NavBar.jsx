import {Stack, Box, Collapse, Button, Typography} from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function NavBar({sx, activePanel, setActivePanel}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const NavButton = (section, path) => (
    <Button
      variant="menu2"
      sx={{height:"100%",
        color: location.pathname === path
          ? "var(--red)"
          : "var(--brown)",
        borderColor: location.pathname === path
          ? "var(--red)"
          : "var(--brown)",
      }}
      onClick={() => navigate(path)}
      
    >
      <Typography variant="h4">{section}</Typography>
    </Button>
  );

  // ★ CHANGED — onClick now branches depending on whether NavBar is
  // rendered on HomeScreen (setActivePanel is a real function, passed in
  // as a prop) or on some other screen (setActivePanel is undefined,
  // since e.g. QuestsScreen renders <NavBar/> with no props at all).
  const NavPanelButton = (string, section) => (
    <Button
      variant="menu2"
      sx={{height:"100%",
        color: activePanel === section
          ? "var(--red)"
          : "var(--brown)",
        borderColor: activePanel === section
          ? "var(--red)"
          : "var(--brown)",
      }}
      onClick={() => {
        if (setActivePanel) {
          // already on HomeScreen — just open the panel directly, no navigation needed
          setActivePanel(section);
        } else {
          // ★ ADDED — on any other screen: navigate to Home and tell it
          // which panel to open once it mounts, via router location state
          navigate("/home", { state: { openPanel: section } });
        }
        setOpen(!open);
      }}
    >
      <Typography variant="h4">{string}</Typography>
    </Button>
  );

  return (
    <Stack spacing={2} sx={sx}>
      <Stack spacing={2} direction="row">
        <Box sx={{flex:1}}/>
        <Collapse orientation="vertical" in={open}>
          <Button
            variant="menu2"
            sx={{height:"100%",
              color: location.pathname === "/home"
                ? "var(--red)"
                : "var(--brown)",
              borderColor: location.pathname === "/home"
                ? "var(--red)"
                : "var(--brown)",
            }}
            onClick={() => navigate("/home")}
            
          >
            <Typography variant="h3">Home</Typography>
          </Button>
        </Collapse>
        <Box sx={{flex:1}}/>
      </Stack>
      <Stack spacing={2} direction="row">
        <Box sx={{flex:1}}/>
        <Collapse orientation="horizontal" in={open}>
          <Stack spacing={2} direction="row" sx={{height:"100%"}}>
            {NavPanelButton("\u2009Critters\u2009", "critters")}
            {NavPanelButton("\u2009\u2009\u2009Shop\u2009\u2009\u2009", "shop")}
            {NavButton("\u2009Settings\u2009", "/settings")}
          </Stack>
        </Collapse>

        <Button variant="menu" onClick={() => setOpen(!open)}>
          <Typography variant="h3">{open ? "✕" : "Menu"}</Typography>
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
    </Stack>
  )
};