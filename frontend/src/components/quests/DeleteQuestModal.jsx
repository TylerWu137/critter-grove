import { Modal, Box, Stack, Typography, Button } from "@mui/material";

import { useQuests } from "../../context/QuestsContext";

export default function DeleteQuestModal() {
  const { deleteModalOpen, closeDeleteModal, confirmDeleteQuest, questToDelete } = useQuests();

  if (!questToDelete) return null;

  return (
    <Modal open={deleteModalOpen} onClose={closeDeleteModal} sx={{ zIndex: 1400 }}>
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
            Delete "{questToDelete.name}"?
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--brown)" }}>
            This can't be undone.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={closeDeleteModal}
              sx={{ color: "var(--cream)", borderColor: "var(--brown)" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={confirmDeleteQuest}
              sx={{ backgroundColor: "var(--red)" }}
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}