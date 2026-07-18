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
} from "@mui/material";

import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import { useQuests } from "../../context/QuestsContext";

export default function QuestCard({ quest }) {
  const {
    toggleQuestCompletion,
    getTagById,
    questTags,
    editQuest,
    editingQuestId,      // ★ ADDED — from context now
    startEditingQuest,   // ★ ADDED
    stopEditingQuest,    // ★ ADDED
    openDeleteModal,     // ★ ADDED
  } = useQuests();

  const tag = quest.tagId ? getTagById(quest.tagId) : null;
  const isEditing = editingQuestId === quest.id; // ★ CHANGED — derived from context, not local state

  // three-dot menu — stays local; it's a DOM anchor ref specific to this card
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null); // 'edit' | 'delete' | null

  // edit form draft fields — stay local; only committed to context on Save
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
    startEditingQuest(quest.id); // ★ CHANGED — was setIsEditing(true)
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    openDeleteModal(quest); // ★ CHANGED — was setDeleteOpen(true); now hands the quest to context
    handleMenuClose();
  };

  const handleEditCancel = () => {
    stopEditingQuest(); // ★ CHANGED — was setIsEditing(false)
    resetEditState();
  };

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

    stopEditingQuest(); // ★ CHANGED — was setIsEditing(false)
  };

  // ---- EDIT MODE ----
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
              sx={{ minWidth: 90, height: 36, textTransform: "capitalize", color: "var(--brown)" }}
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
              sx={{
                flex: 1, minWidth: 0, opacity: isEditDaily ? 0.4 : 1,
                "& .MuiOutlinedInput-input": { py: 0.8 },
              }}
            />

            <TextField
              type="time"
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}
              size="small"
              disabled={isEditDaily}
              sx={{
                flex: 1, minWidth: 0, opacity: isEditDaily ? 0.4 : 1,
                "& .MuiOutlinedInput-input": { py: 0.8 },
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

      <Popover
        open={menuOpen}
        anchorEl={menuAnchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              ml: 1.5,
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
                background: `linear-gradient(to bottom, ${
                  hoveredButton === "edit" ? "var(--brown)" : "var(--cream)"
                } 50%, ${
                  hoveredButton === "delete" ? "var(--brown)" : "var(--cream)"
                } 50%)`,
                borderBottom: "2px solid var(--brown)",
                borderLeft: "2px solid var(--brown)",
                transition: "background 200ms ease",
              },
            },
          },
        }}
      >
        <Stack sx={{ width: "auto", overflow: "hidden", borderRadius: 3 }}>
          <Button
            onClick={handleEditClick}
            onMouseEnter={() => setHoveredButton("edit")}
            onMouseLeave={() => setHoveredButton(null)}
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
            onMouseEnter={() => setHoveredButton("delete")}
            onMouseLeave={() => setHoveredButton(null)}
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
    </>
  );
}