import {Stack, Box, Typography, Button, Link} from "@mui/material";
import { useNavigate } from "react-router-dom";

import logoImage from "../assets/images/logo.png";
import SplashscreenSkeleton from "../components/SplashscreenSkeleton";

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <SplashscreenSkeleton
      leftContent={
        <Box
          component="img"
          src
          alt="logo"
          sx={{
            flex: 1,
            backgroundColor: "var(--cream)"
          }}
        />
      }

      rightContent={
        <Stack
          spacing={4}
          sx={{
            alignItems: "flex-start",
            flex: 1
          }}
        >
          <Typography variant="h1" sx={{color:"var(--brown)"}}>Description</Typography>
          <Typography variant="body1" sx={{color:"var(--cream)"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris egestas odio vitae orci pulvinar, quis eleifend orci pretium. Vivamus vulputate orci ut arcu egestas, nec finibus est fermentum. </Typography>
          <Box sx={{flex: 1}}></Box>
          <Stack spacing={1} sx={{alignItems: "center", width: "100%"}}>
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{ 
                fontSize: 20,
                width: "40%",
                backgroundColor: "var(--brown)",
                borderRadius: 4
              }}
            >Begin</Button>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="caption" sx={{color: "var(--cream)"}}>Don't have an account?</Typography>
              <Link component="button" onClick={() => navigate("/signup")} variant="caption" sx={{color: "var(--cream)", textDecorationColor: "inherit"}}>Sign Up!</Link>
            </Stack>
          </Stack>
        </Stack>
      }
    />
  );
}