import { useState } from "react";
import {Stack, Box, Typography, Button, Link} from "@mui/material";
import { useNavigate } from "react-router-dom";

import SplashscreenSkeleton from "../components/SplashscreenSkeleton";
import UserAccountTextField from "../components/UserAccountTextField";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ★ CHANGED — was: const success = login(email, password); (synchronous
  // boolean). login() now hits a real API and returns a promise resolving
  // to { success, error }, so this needs to be async and await the result.
  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      navigate("/home");
    } else {
      setError(result.error || "Incorrect email or password.");
    }
  };

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
              <Link component="button" onClick={() => navigate("/signup")} variant="caption" sx={{color: "var(--cream)", textDecorationColor: "inherit"}}>Sign Up here!</Link>
            </Stack>
          </Stack>
          <Stack spacing={2} sx={{width: "100%"}}>
            <UserAccountTextField
              field="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
            <UserAccountTextField
              field="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              error={Boolean(error)}
              helperText={error}
            />
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
              onClick={handleLogin}
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