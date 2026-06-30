import {Stack, Box} from "@mui/material";

export default function WelcomeScreen() {
  return (
    <Stack sx={{ height: "100vh" }}>
      <Box sx={{ flex: 2 }} />

      <Box
        sx={{
          flex: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "var(--green)",
          fontFamily: "var(--fredoka-one)",
          fontSize: 40
        }}
      >
        Grass
      </Box>

      <Box
        sx={{
          flex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "var(--cream)"
        }}
      >
        Bottom Menu
      </Box>
    </Stack>
  );
}