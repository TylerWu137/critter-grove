import { useState } from "react";
import { Stack, Box, Typography, Button, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

import SplashscreenSkeleton from "../components/SplashscreenSkeleton";
import UserAccountTextField from "../components/UserAccountTextField";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";

export default function SignUpScreen() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { createProfile } = useProfile();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    // ★ CHANGED — signUp() now hits the real backend and returns a
    // promise; this must be awaited (was previously a synchronous local call)
    const authResult = await signUp(email, password);
    if (!authResult.success) {
      setError(authResult.error);
      return;
    }

    // profile creation is still local/dummy for now — not yet migrated
    // to the backend, so this stays synchronous
    const profileResult = createProfile(authResult.userId, name);
    if (!profileResult.success) {
      // NOTE: the user now exists for real on the backend at this point —
      // there's no rollback if profile creation fails here. Once profile
      // creation also moves to the backend, this whole flow should become
      // one atomic transaction server-side instead of two separate calls.
      setError(profileResult.error);
      return;
    }

    navigate("/home");
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
            <Typography variant="h2" sx={{color:"var(--brown)"}}>Sign Up</Typography>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="caption" sx={{color: "var(--cream)"}}>Already have an account?</Typography>
              <Link component="button" onClick={() => navigate("/login")} variant="caption" sx={{color: "var(--cream)", textDecorationColor: "inherit"}}>Log in here!</Link>
            </Stack>
          </Stack>
          <Stack spacing={2} sx={{width: "100%"}}>
            <UserAccountTextField field="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <UserAccountTextField field="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <UserAccountTextField field="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <UserAccountTextField field="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </Stack>
          {error && (
            <Typography variant="body2" sx={{ color: "var(--red)" }}>{error}</Typography>
          )}
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
              onClick={handleSignUp}
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