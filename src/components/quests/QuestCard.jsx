import { useState } from "react";
import {
  Stack,
  Box,
  Typography,
  IconButton,
  Popover,
  TextField,
  Select,
  MenuItem,
  Button,
  Modal,
} from "@mui/material";

import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import { useQuests } from "../../context/QuestsContext";
import FullScreenBackdrop from "../common/FullScreenBackdrop"; // adjust path if it lives elsewhere

export default function QuestCard({ quest }) {
  const { toggleQuestCompletion, getTagById, questTags, editQuest, deleteQuest } = useQuests();

  const tag = quest.tagId ? getTagById(quest.tagId) : null;

  // three-dot menu / edit-mode / delete-confirm state
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // edit form fields — seeded from the quest whenever edit mode opens
  const [editType, setEditType] = useState(quest.type);
  const [editName, setEditName] = useState(quest.name);
  const [editTagId, setEditTagId] = useState(quest.tagId ?? "");
  const [editDate, setEditDate] = useState(quest.date ?? "");
  const [editTime, setEditTime] = useState(quest.time ?? "");

  const menuOpen = Boolean(menuAnchorEl);
  const isEditDaily = editType === "daily";

  const handleMenuOpen = (e) => setMenuAnchorEl(e.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);

  const resetEditState = () => {
    setEditType(quest.type);
    setEditName(quest.name);
    setEditTagId(quest.tagId ?? "");
    setEditDate(quest.date ?? "");
    setEditTime(quest.time ?? "");
  };

  const handleEditClick = () => {
    resetEditState();
    setIsEditing(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteOpen(true);
    handleMenuClose();
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    resetEditState();
  };

  // mirrors AddQuestPopover's behavior: switching to "daily" clears date/time
  // so a stale value can't be silently saved while the fields are disabled
  const handleEditTypeChange = (e) => {
    const newType = e.target.value;
    setEditType(newType);
    if (newType === "daily") {
      setEditDate("");
      setEditTime("");
    }
  };

  const handleEditSave = () => {
    if (!editName.trim()) return;

    editQuest(quest.id, {
      type: editType,
      name: editName.trim(),
      tagId: editTagId === "" ? null : editTagId,
      date: editDate === "" ? null : editDate,
      time: editTime === "" ? null : editTime,
    });

    setIsEditing(false);
  };

  const handleDeleteConfirm = () => {
    deleteQuest(quest.id);
    setDeleteOpen(false);
  };

  // ---- EDIT MODE: card becomes the same row-1/row-2 form as AddQuestPopover ----
  if (isEditing) {
    return (
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", width: "auto" }}>
        <Stack
          spacing={1.5}
          sx={{
            flex: 1,
            p: 1,
            border: "1px solid",
            borderColor: tag?.color ?? "var(--brown)",
            borderRadius: 2,
          }}
        >
          {/* row 1 — cancel (x), type, description, save */}
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <IconButton
              onClick={handleEditCancel}
              sx={{ p: 0.5, color: "var(--brown)", flexShrink: 0 }}
            >
              <CloseIcon sx={{ fontSize: "18px" }} />
            </IconButton>

            <Select
              value={editType}
              onChange={handleEditTypeChange}
              size="small"
              sx={{
                minWidth: 90,
                height: 36,
                textTransform: "capitalize",
                color: "var(--brown)",
              }}
            >
              <MenuItem value="daily" sx={{ textTransform: "capitalize" }}>
                <Typography variant="text" component="span">Daily</Typography>
              </MenuItem>
              <MenuItem value="epic" sx={{ textTransform: "capitalize" }}>
                <Typography variant="text" component="span">Epic</Typography>
              </MenuItem>
              <MenuItem value="side" sx={{ textTransform: "capitalize" }}>
                <Typography variant="text" component="span">Side</Typography>
              </MenuItem>
            </Select>

            <TextField
              variant="standard"
              placeholder="Quest description..."
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              sx={{
                flex: 1,
                minWidth: 0,
                "& .MuiInput-root": { fontWeight: 400, color: "var(--brown)" },
                "& .MuiInput-underline:before": { borderBottomColor: "var(--light-brown)" },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottomColor: "var(--brown)" },
                "& .MuiInput-underline:after": { borderBottomColor: "var(--brown)" },
              }}
            />

            <Button
              onClick={handleEditSave}
              variant="menu2"
              sx={{
                fontWeight: 500,
                flexShrink: 0,
                "&:hover": { color: "var(--red)", borderColor: "var(--red)" },
              }}
            >
              <Typography variant="text" component="span" sx={{ fontWeight: 500 }}>
                Save
              </Typography>
            </Button>
          </Stack>

          {/* row 2 — tag, date, time */}
          <Stack direction="row" spacing={1}>
            <Select
              value={editTagId}
              onChange={(e) => setEditTagId(e.target.value)}
              displayEmpty
              size="small"
              sx={{
                flex: 1,
                minWidth: 0,
                height: 36,
                color: "var(--brown)",
                "& .MuiSelect-select": {
                  paddingTop: "4px !important",
                  paddingBottom: "4px !important",
                  minHeight: "unset !important",
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <MenuItem value="" sx={{ textTransform: "capitalize" }}>
                <Typography variant="text" component="span">No tag</Typography>
              </MenuItem>
              {questTags.map((t) => (
                <MenuItem key={t.id} value={t.id} sx={{ textTransform: "capitalize" }}>
                  <Typography variant="text" component="span">{t.name}</Typography>
                </MenuItem>
              ))}
            </Select>

            <TextField
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              size="small"
              disabled={isEditDaily}
              sx={{ flex: 1, minWidth: 0, opacity: isEditDaily ? 0.4 : 1,
                "& .MuiOutlinedInput-input": {
                  py: 0.8,
                },
                }}
            />

            <TextField
              type="time"
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}
              size="small"
              disabled={isEditDaily}
              sx={{ flex: 1, minWidth: 0, opacity: isEditDaily ? 0.4 : 1,
                "& .MuiOutlinedInput-input": {
                  py: 0.8,
                },
                }}
            />
          </Stack>
        </Stack>
      </Stack>
    );
  }

  // ---- NORMAL MODE ----
  return (
    <>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", width: "auto" }}>
        <IconButton onClick={() => toggleQuestCompletion(quest.id)} sx={{ p: 0 }}>
          {quest.isCompleted ? (
            <TaskAltIcon sx={{ fontSize: "medium", color: "var(--brown)" }} />
          ) : (
            <RadioButtonUncheckedIcon sx={{ fontSize: "medium", color: "var(--brown)" }} />
          )}
        </IconButton>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            flex: 1,
            px: 1, py: 1.5,
            alignItems: "center",
            border: "1px solid",
            borderColor: tag?.color ?? "var(--brown)",
            borderRadius: 2,
            opacity: quest.isCompleted ? 0.5 : 1,
          }}
        >
          <Typography
            variant="text"
            sx={{ color: "var(--brown)", textDecoration: quest.isCompleted ? "line-through" : "none" }}
          >
            {quest.name}
          </Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              p: 0.1, borderRadius: 100, color: "var(--brown)",
              transition: "color 200ms ease",
              "&:hover": { color: "var(--cream)", backgroundColor: "var(--light-brown)" },
            }}
          >
            <MoreVertIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </Stack>
      </Stack>

      {/* three-dot menu — opens to the right of the icon, triangle points left */}
      <Popover
        open={menuOpen}
        anchorEl={menuAnchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              ml: 1.5, // room for the triangle pointer
              width: "6vw",
              maxWidth: "6vw",
              overflow: "visible",
              borderRadius: 3,
              border: "2px solid var(--brown)",
              backgroundColor: "var(--cream)",
              boxShadow: "1",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                left: -9,
                top: "50%",
                transform: "translateY(-50%) rotate(45deg)",
                width: 16,
                height: 16,
                backgroundColor: "var(--cream)",
                borderBottom: "2px solid var(--brown)",
                borderLeft: "2px solid var(--brown)",
              },
            },
          },
        }}
      >
        <Stack sx={{ width: "auto", overflow: "hidden", borderRadius: 3 }}>
          <Button
            onClick={handleEditClick}
            startIcon={<EditIcon sx={{ fontSize: "18px" }} />}
            sx={{
              justifyContent: "flex-start",
              pl: 1.5, py: 0,
              borderRadius: 0,
              color: "var(--brown)",
              backgroundColor: "var(--cream)",
              "&:hover": { color: "var(--cream)", backgroundColor: "var(--brown)" },
            }}
          >
            <Typography variant="text" component="span">Edit</Typography>
          </Button>
          <Button
            onClick={handleDeleteClick}
            startIcon={<DeleteIcon sx={{ fontSize: "18px" }} />}
            sx={{
              justifyContent: "flex-start",
              pl: 1, py: 0,
              borderRadius: 0,
              color: "var(--brown)",
              backgroundColor: "var(--cream)",
              "&:hover": { color: "var(--cream)", backgroundColor: "var(--brown)" },
            }}
          >
            <Typography variant="text" component="span">Delete</Typography>
          </Button>
        </Stack>
      </Popover>

      {/* delete confirmation — full-screen backdrop */}
      {/* delete confirmation — mirrors ReleaseConfirmModal's structure/styling */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} sx={{ zIndex: 1400 }}>
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
              Delete "{quest.name}"?
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--brown)" }}>
              This can't be undone.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => setDeleteOpen(false)}
                sx={{ color: "var(--cream)", borderColor: "var(--brown)" }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleDeleteConfirm}
                sx={{ backgroundColor: "var(--red)" }}
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}