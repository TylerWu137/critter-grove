import { useState } from "react";
import { Stack, Box, Typography, Button, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

import SplashscreenSkeleton from "../components/SplashscreenSkeleton";
import UserAccountTextField from "../components/UserAccountTextField";
import FirstCritterPicker from "../components/common/FirstCritterPicker"; // ★ ADDED
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // ★ ADDED — needed for the direct catch/awaken calls below

export default function SignUpScreen() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedSpeciesId, setSelectedSpeciesId] = useState(null); // ★ ADDED
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    const authResult = await signUp(email, password, name);
    if (!authResult.success) {
      setError(authResult.error);
      return;
    }

    // ★ ADDED — give the new account its chosen starter critter,
    // auto-companioned. Done as two direct fetch calls (not through
    // CrittersContext) since CrittersProvider isn't mounted here — it's
    // scoped inside CrittersPanel, not available app-wide. Best-effort:
    // if this fails, the account still exists and is usable, so we don't
    // block navigation over it — just log it for now.
    if (selectedSpeciesId) {
      try {
        const catchRes = await fetch(`${API_BASE_URL}/api/critters`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authResult.token}`,
          },
          body: JSON.stringify({ speciesId: selectedSpeciesId }),
        });

        if (catchRes.ok) {
          const newCritter = await catchRes.json();
          await fetch(`${API_BASE_URL}/api/critters/${newCritter.id}/awaken`, {
            method: "POST",
            headers: { Authorization: `Bearer ${authResult.token}` },
          });
        }
      } catch (err) {
        console.warn("Couldn't assign starter critter:", err);
      }
    }

    navigate("/home");
  };

  return (
    <SplashscreenSkeleton
      leftContent={
        // ★ CHANGED — was a bare <img> placeholder; now the starter-critter
        // picker (artwork placeholder + 5 selectable critter boxes)
        <FirstCritterPicker
          selectedSpeciesId={selectedSpeciesId}
          onSelect={setSelectedSpeciesId}
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