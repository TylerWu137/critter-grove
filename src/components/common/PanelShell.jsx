import { Stack, Box, Typography } from "@mui/material";

import HelpButton from "./HelpButton";

export default function PanelShell({ title, children, footerLeft, footerRight }) {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        backgroundColor: "var(--cream)",
        boxSizing: "border-box",
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        pt: 4,
        pb: 2,
        pl: 4,
        pr: 4,
      }}
    >
      <Stack spacing={4} sx={{ height: "100%", width: "100%", alignItems: "center" }}>
        <Stack direction="row" sx={{ width: "100%" }}>
          <Typography variant="h2" sx={{ color: "var(--red)" }}>{title}</Typography>
          <Box sx={{ flex: 1 }} />
          <HelpButton />
        </Stack>

        <Box sx={{ display: "flex", flex: 1, overflow: "hidden", width: "100%" }}>
          {children}
        </Box>

        <Stack direction="row" sx={{ width: "100%", alignItems: "flex-end" }}>
          {footerLeft}
          <Box sx={{ flex: 1 }} />
          {footerRight}
        </Stack>
      </Stack>
    </Box>
  );
}