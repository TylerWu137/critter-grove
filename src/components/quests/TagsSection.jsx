import { useState } from "react";
import { Stack, Typography, Checkbox, TextField, IconButton, Box } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';

import { useQuests } from "../../context/QuestsContext";
import AddButton from "../common/AddButton";

export default function TagsSection({ sx }) {
  const { questTags, selectedTagIds, toggleTagFilter, addTag } = useQuests();

  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const handleAddClick = () => setIsAdding(true);

  const handleCancel = () => {
    setIsAdding(false);
    setNewTagName("");
  };

  const handleSave = () => {
    if (!newTagName.trim()) return;
    addTag(newTagName.trim());
    setIsAdding(false);
    setNewTagName("");
  };

  return (
    // ★ CHANGED — outer Stack still spacing={1}, matching QuestsSection's
    // own spacing={1}, so the gap between title and content is identical
    <Stack spacing={1} sx={{ width: "15%", height: "100%", ...sx }}>
      <Box sx={{flex: 0.2}}/>
      <Typography variant="h3" sx={{ pl: 2, color: "var(--brown)" }}>
        Tags
      </Typography>

      <Stack spacing={1} sx={{ pl: 1 }}>
        {questTags.map((tag) => (
          <Stack key={tag.id} direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <Checkbox
              checked={selectedTagIds.includes(tag.id)}
              onChange={() => toggleTagFilter(tag.id)}
              sx={{
                p: 0.5,
                color: tag.color,
                "&.Mui-checked": { color: tag.color },
              }}
            />
            <Typography variant="text" sx={{ color: "var(--brown)", textTransform: "capitalize" }}>
              {tag.name}
            </Typography>
          </Stack>
        ))}

        {isAdding ? (
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", pl: 0.5 }}>
            <IconButton onClick={handleCancel} sx={{ p: 0.5, color: "var(--brown)" }}>
              <CloseIcon sx={{ fontSize: "18px" }} />
            </IconButton>
            <TextField
              variant="standard"
              placeholder="Add new tag"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              autoFocus
              sx={{
                flex: 1,
                minWidth: 0,
                "& .MuiInput-root": { fontWeight: 500, color: "var(--brown)", fontSize: "15px" },
                "& .MuiInput-underline:before": { borderBottomColor: "var(--light-brown)" },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottomColor: "var(--brown)" },
                "& .MuiInput-underline:after": { borderBottomColor: "var(--brown)" },
              }}
            />
            {/* ★ CHANGED — was a text Button; now a small check-icon IconButton */}
            <IconButton onClick={handleSave} sx={{ p: 0.5, color: "var(--red)", flexShrink: 0 }}>
              <CheckIcon sx={{ fontSize: "18px" }} />
            </IconButton>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", pl: 0.8 }}>
            {/* ★ CHANGED — wrapped in a Box with transform: scale to shrink
                AddButton visually without touching its own source. transformOrigin
                keeps it left-anchored so it doesn't shift the row's spacing oddly. */}
            <IconButton onClick={handleAddClick} sx={{border: "1.5px solid var(--red)", color: "var(--red)",
                transition: "color 200ms ease",
                p: 0,
                ...sx,
            }}>
                <AddIcon sx={{fontSize: "18px"}} />
            </IconButton>
            <Typography variant="text" sx={{ color: "var(--red)" }}>
              Add new tag
            </Typography>
          </Stack>
        )}
      </Stack>
      <Box sx={{flex: 1}}/>
    </Stack>
  );
}