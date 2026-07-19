import { useState } from "react";
import { Stack, Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';

import ScreenShell from "../components/common/ScreenShell";
import InProgressPlaceholder from "../components/common/InProgressPlaceholder";
import LogoutConfirmModal from "../components/common/LogoutConfirmModal";

export default function SettingsScreen() {
  const navigate = useNavigate();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    // NOTE: there's no AuthContext yet, so this just navigates away —
    // once real auth exists, clear the session/token here too before navigating
    navigate("/");
  };

  return (
    <ScreenShell title="Settings">
      <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
        <Stack direction="row" sx={{ width: "100%", justifyContent: "flex-end" }}>
          <Button
            variant="menu2"
            onClick={() => setLogoutModalOpen(true)}
            startIcon={<LogoutIcon />}
            sx={{
              color: "var(--red)",
              borderColor: "var(--red)",
              "&:hover": { backgroundColor: "var(--red)", color: "var(--cream)", borderColor: "var(--red)" },
            }}
          >
            <Typography variant="text">Log Out</Typography>
          </Button>
        </Stack>

        <Box sx={{ flex: 1, minHeight: 0 }}>
          <InProgressPlaceholder label="Settings" />
        </Box>
      </Stack>

      <LogoutConfirmModal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </ScreenShell>
  );
}