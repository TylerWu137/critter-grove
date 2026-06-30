import {Stack, Box, Typography, Button, Link} from "@mui/material";
import logoImage from "../assets/images/logo.png";
import FullScreenButton from "../components/FullScreenButton";

export default function WelcomeScreen() {
  return (
    <Stack sx={{ height: "100vh",  backgroundColor: "var(--cream)"}}>
      <Box sx={{ flex: 2, display: "flex", justifyContent: "right"}}><FullscreenButton/></Box>

      <Stack
        direction="row"
        spacing={10}
        sx={{
          display: "flex",
          flex: 4.5,
          py: 10,
          px: 20,
          backgroundColor: "var(--green)"
        }}
      >
        <Box
          component="img"
          src
          alt="logo"
          sx={{
            height: "auto",
            flex: 4,
            backgroundColor: "var(--cream)"
          }}
        />
        <Stack
          spacing={4}
          sx={{
            display: "flex",
            alignItems: "left",
            height: "auto",
            flex: 4
          }}
        >
          <Typography variant="h1" sx={{color:"var(--brown)"}}>Description</Typography>
          <Typography variant="body1" sx={{color:"var(--cream)"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris egestas odio vitae orci pulvinar, quis eleifend orci pretium. Vivamus vulputate orci ut arcu egestas, nec finibus est fermentum. </Typography>
          <Box sx={{flex: 1}}></Box>
          <Stack spacing={1} sx={{display: "flex", alignItems: "center", width: "100%"}}>
            <Button
              variant="contained"
              sx={{ 
                fontSize: 20,
                width: "40%",
                backgroundColor: "var(--brown)",
                borderRadius: 4
              }}
            >Begin</Button>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="caption" sx={{color: "var(--cream)"}}>Don't have an account?</Typography>
              <Link href="#" variant="caption" sx={{color: "var(--cream)", textDecorationColor: "inherit"}}>Sign Up!</Link>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <Box
        sx={{
          flex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "var(--cream)"
        }}
      >
        Critter Animation
      </Box>
    </Stack>
  );
}