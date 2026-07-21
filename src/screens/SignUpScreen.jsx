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

  const handleSignUp = () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    // create the login (email/password) first
    const authResult = signUp(email, password);
    if (!authResult.success) {
      setError(authResult.error);
      return;
    }

    // then create the profile (checks name uniqueness) for that new user
    const profileResult = createProfile(authResult.userId, name);
    if (!profileResult.success) {
      // NOTE: the user row from signUp() above already exists at this point
      // (dummy in-memory data, no rollback implemented) — with a real
      // backend this whole flow should be one transaction instead of two
      // separate calls, so a failure here doesn't leave an orphaned user.
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