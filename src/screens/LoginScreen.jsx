import {Stack, Box, Typography, Button, Link, TextField} from "@mui/material";
import { useNavigate } from "react-router-dom";

import SplashscreenSkeleton from "../components/SplashscreenSkeleton";
import UserAccountTextField from "../components/UserAccountTextField";

export default function LoginScreen() {
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
            <Typography variant="h2" sx={{color:"var(--brown)"}}>Login</Typography>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="caption" sx={{color: "var(--cream)"}}>Don't have an account?</Typography>
              <Link href="/signup" variant="caption" sx={{color: "var(--cream)", textDecorationColor: "inherit"}}>Sign Up here!</Link>
            </Stack>
          </Stack>
          <Stack spacing={2} sx={{width: "100%"}}>
            <UserAccountTextField field="Email"/>
            <UserAccountTextField field="Password"/>
          </Stack>
          <Box sx={{flex: 1}}></Box>
          <Stack direction="row" sx={{width: "100%"}}>
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{ 
                fontSize: 20,
                width: "30%",
                backgroundColor: "var(--brown)",
                borderRadius: 4
              }}
            >Back</Button>
            <Box sx={{flex: 1}}/>
            <Button
              variant="contained"
              onClick={() => navigate("/home")}
              sx={{ 
                fontSize: 20,
                width: "30%",
                backgroundColor: "var(--brown)",
                borderRadius: 4
              }}
            >Login</Button>
          </Stack>
        </Stack>
      }
    />
  );
}