import { Modal, Box, Stack, Typography, Button } from "@mui/material";

export default function LogoutConfirmModal({ open, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose} sx={{ zIndex: 1400 }}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "var(--cream)",
          borderRadius: 4,
          p: 4,
          width: 320,
          textAlign: "center",
        }}
      >
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <Typography variant="h4" sx={{ color: "var(--brown)" }}>
            Log out?
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--brown)" }}>
            You'll need to log back in to continue.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ borderColor: "var(--brown)" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={onConfirm}
              sx={{ backgroundColor: "var(--red)" }}
            >
              Log Out
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}