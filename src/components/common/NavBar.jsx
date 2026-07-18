import { Stack, Box, Collapse, Button, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react"; // ★ CHANGED — added useRef, useEffect
import { useLocation, useNavigate } from "react-router-dom";

export default function NavBar({ sx, activePanel, setActivePanel }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null); // ★ ADDED — wraps the whole NavBar, used to detect outside clicks

  // ★ ADDED — closes the menu on any click/tap that lands outside containerRef.
  // Only attaches the listener while open, so it's not doing extra work
  // (or risking closing on unrelated clicks) when the menu is already shut.
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    // mousedown (not click) so this fires before any inside-button's own
    // onClick logic potentially changes what's rendered
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

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
    <Box ref={containerRef} sx={{ position: "fixed", bottom: 24, left: 24, zIndex: 1200, ...sx }}> {/* ★ CHANGED — added ref */}
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
  );
}