import {Stack, Box, Typography, Button, Link} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

import SplashscreenSkeleton from "../components/SplashscreenSkeleton";
import UserAccountTextField from "../components/UserAccountTextField";

export default function SignUpScreen() {
  const navigate = useNavigate();

  return (
    <SplashscreenSkeleton
      leftContent={
        <Box
          component="img"
          src
          alt="critter animation"
          sx={{
            flex: 1,
            backgroundColor: "var(--cream)"
          }}
        />
      }
      rightContent={
        <Stack
          spacing={2}
          sx={{
            alignItems: "flex-start",
            flex: 1
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h2" sx={{color:"var(--brown)"}}>Sign Up</Typography>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="caption" sx={{color: "var(--cream)"}}>Already have an account?</Typography>
              <Link component={RouterLink} to="/login" variant="caption" sx={{color: "var(--cream)", textDecorationColor: "inherit"}}>Login here!</Link>
            </Stack>
          </Stack>
          <Stack spacing={2} sx={{width: "100%"}}>
            <UserAccountTextField field="Email"/>
            <UserAccountTextField field="Username"/>
            <UserAccountTextField field="Password"/>
            <UserAccountTextField field="Confirm Password"/>
          </Stack>
          <Box sx={{flex: 1}}></Box>
          <Stack direction="row" sx={{width: "100%"}}>
            <Button
              onClick={() => navigate("/")}
              sx={{ 
                width: "30%"
              }}
            >Back</Button>
            <Box sx={{flex: 1}}/>
            <Button
              onClick={() => navigate("/home")}
              sx={{ 
                width: "30%",
              }}
            >Login</Button>
          </Stack>
        </Stack>
      }
    />
  );
}