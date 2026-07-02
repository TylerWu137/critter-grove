import {Stack, Box, Typography, Button, Link, ToggleButtonGroup, ToggleButton} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import SplashscreenSkeleton from "../components/SplashscreenSkeleton";
import UserAccountTextField from "../components/UserAccountTextField";

export default function SignUpScreen() {
  const navigate = useNavigate();
  const [value, setValue] = useState("critter3");

  return (
    <SplashscreenSkeleton
      leftContent={
        <Stack spacing={2} sx={{ flex: 1, alignItems: "center"}}>
          <Box
            component="img"
            src
            alt="critter animation"
            sx={{
              flex: 1,
              backgroundColor: "var(--cream)",
              width: "80%"
            }}
          />
          <ToggleButtonGroup
            value={value}
            exclusive
            onChange={(e, newValue) => {
              if (newValue !== null) setValue(newValue);
            }}
            sx={{
              "& .MuiToggleButton-root": {
                backgroundColor: "var(--cream)",
                color: "var(--brown)",

                "&.Mui-selected": {
                  backgroundColor: "var(--cream)",
                  borderTop: "2px solid var(--brown)",
                  borderBottom: "2px solid var(--brown)",
                  borderLeft: "none",
                  borderRight: "none",
                },

                "& hover": {
                  borderColor: "var(--brown)",
                  backgroundColor: "var(--cream)"
                },
                "&:not(:last-of-type)::after": {
                  content: '""',
                  position: "absolute",
                  right: 0,
                  top: "0%",
                  height: "100%",
                  width: "2px",
                  backgroundColor: "var(--light-brown)",
                  opacity: 1,
                },
              },
            }}
          >
            <ToggleButton value="critter1">__A__</ToggleButton>
            <ToggleButton value="critter2">__B__</ToggleButton>
            <ToggleButton value="critter3">__C__</ToggleButton>
            <ToggleButton value="critter4">__D__</ToggleButton>
            <ToggleButton value="critter5">__E__</ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="body1" sx={{color:"var(--cream)"}}>Rescue your first critter!</Typography>
        </Stack>
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
              <Link component="button" onClick={() => navigate("/login")} variant="caption" sx={{color: "var(--cream)", textDecorationColor: "inherit"}}>Login here!</Link>
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
            >Sign Up</Button>
          </Stack>
        </Stack>
      }
    />
  );
}