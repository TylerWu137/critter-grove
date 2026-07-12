import { Modal, Box, Stack, Typography, Button } from "@mui/material";

import { useCritters } from "./CrittersContext";

export default function ReleaseConfirmModal() {
  const { releaseModalOpen, closeReleaseModal, releaseCritter, selectedCritter } = useCritters();

  if (!selectedCritter) return null;

  return (
    <Modal open={releaseModalOpen} onClose={closeReleaseModal} sx={{ zIndex: 1400 }}>
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
            Release {selectedCritter.name}?
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--brown)" }}>
            This can't be undone.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={closeReleaseModal}
              sx={{ color: "var(--cream)", borderColor: "var(--brown)" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={releaseCritter}
              sx={{ backgroundColor: "var(--red)" }}
            >
              Release
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}