import { Stack, Box, Collapse, Button, Typography } from "@mui/material";
import { useState } from "react"; // ★ CHANGED — no longer need useRef/useEffect
import { useLocation, useNavigate } from "react-router-dom";

import FullScreenBackdrop from "./FullScreenBackdrop"; // ★ ADDED — adjust path if it lives elsewhere

export default function NavBar({ sx, activePanel, setActivePanel }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const NavButton = (section, path) => (
    <Button
      variant="menu2"
      sx={{
        height: "100%",
        color: location.pathname === path ? "var(--red)" : "var(--brown)",
        borderColor: location.pathname === path ? "var(--red)" : "var(--brown)",
      }}
      onClick={() => navigate(path)}
    >
      <Typography variant="h4">{section}</Typography>
    </Button>
  );

  const NavPanelButton = (string, section) => (
    <Button
      variant="menu2"
      sx={{
        height: "100%",
        color: activePanel === section ? "var(--red)" : "var(--brown)",
        borderColor: activePanel === section ? "var(--red)" : "var(--brown)",
      }}
      onClick={() => {
        if (setActivePanel) {
          setActivePanel(section);
        } else {
          navigate("/home", { state: { openPanel: section } });
        }
        setOpen(!open);
      }}
    >
      <Typography variant="h4">{string}</Typography>
    </Button>
  );

  return (
    <>
      {/* ★ ADDED — transparent full-screen overlay, only mounted while open.
          zIndex 1199 (one below NavBar's own 1200) means every OTHER
          element on the page sits underneath it and can't receive clicks,
          but NavBar's own buttons — which live in a Box at zIndex 1200 —
          still render above it and remain fully clickable. Clicking
          anywhere on the overlay just closes the menu; the click never
          reaches whatever's visually behind it. */}
      <FullScreenBackdrop
        open={open}
        onClick={() => setOpen(false)}
        zIndex={1199}
        sx={{ backgroundColor: "transparent" }}
      />

      <Box sx={{ position: "fixed", bottom: 24, left: 24, zIndex: 1200, ...sx }}>
        <Stack sx={{ flexDirection: "column-reverse", alignItems: "flex-start" }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Button variant="menu" onClick={() => setOpen(!open)}>
              <Typography variant="h3">{open ? "✕" : "Menu"}</Typography>
            </Button>

            <Collapse orientation="horizontal" in={open}>
              <Stack direction="row" spacing={2} sx={{ height: "100%", pl: 2 }}>
                {NavButton("\u2009Quests\u2009", "/quests")}
                {NavButton("Calendar", "/calendar")}
                {NavButton("Journal", "/journal")}
              </Stack>
            </Collapse>
          </Stack>

          <Collapse orientation="vertical" in={open}>
            <Stack spacing={2} sx={{ alignItems: "flex-start", pb: 2 }}>
              {NavButton("Home", "/home")}
              {NavPanelButton("\u2009Critters\u2009", "critters")}
              {NavPanelButton("\u2009\u2009\u2009Shop\u2009\u2009\u2009", "shop")}
              {NavButton("\u2009Settings\u2009", "/settings")}
            </Stack>
          </Collapse>
        </Stack>
      </Box>
    </>
  );
}