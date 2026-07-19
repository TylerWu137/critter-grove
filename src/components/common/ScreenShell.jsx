import { Stack, Box, Typography } from "@mui/material";

import PlayerTopBar from "../PlayerTopBar/PlayerTopBar";
import NavBar from "./NavBar";
import HelpButton from "./HelpButton";

export default function ScreenShell({ title, headerCenter, children }) {
  return (
    <Stack sx={{ height: "100%", boxSizing: "border-box" }}>
      <PlayerTopBar sx={{ pt: 4, pb: 2, pl: 4, pr: 4, backgroundColor: "var(--green)" }} />
      <Stack
        spacing={2}
        sx={{
          pt: 4,
          pb: 10,
          pl: 4,
          pr: 4,
          borderTop: "2px solid var(--brown)",
          flex: 100,
          minHeight: 0,
          backgroundColor: "var(--cream)",
        }}
      >
        <Stack direction="row" sx={{ width: "100%" }}>
          <Typography variant="h2" sx={{ flex: 1, color: "var(--red)" }}>{title}</Typography>
          {headerCenter && (
            <Stack direction="row" spacing={2} sx={{ flex: 5, justifyContent: "center" }}>
              {headerCenter}
            </Stack>
          )}
          <HelpButton sx={{ flex: 1 }} />
        </Stack>

        <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, width: "100%" }}>
          {children}
        </Box>
      </Stack>
      <NavBar />
    </Stack>
  );
}