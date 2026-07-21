import { useState } from "react";
import { Stack, Typography, Checkbox, TextField, IconButton, Box } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';

import { useQuests } from "../../context/QuestsContext";
import AddButton from "../common/AddButton";
import { useScrollEdges } from "../../hooks/useScrollEdges"; // ★ ADDED

export default function TagsSection({ sx }) {
  const { questTags, selectedTagIds, toggleTagFilter, addTag } = useQuests();

  const [isAdding, setIsAdding] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  // ★ ADDED — re-checks whenever the tag list length changes (e.g. after
  // adding a new tag), since that can change whether there's overflow at all
  const { ref: tagsListRef, canScrollUp, canScrollDown, onScroll } = useScrollEdges([questTags.length]);

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
    <Stack spacing={1} sx={{ width: "15%", height: "100%", ...sx}}>
      <Box sx={{height: "10%"}}/>
      <Typography variant="h3" sx={{ pl: 2, color: "var(--brown)" }}>
        Tags
      </Typography>

      <Stack sx={{ pl: 1 }}>
        {/* ★ CHANGED — added position:"relative" wrapper so the edge
            indicators (position:"absolute") anchor to this box, not the page */}
        <Box sx={{ position: "relative", height: "67%" }}>
          <Box
            ref={tagsListRef} // ★ ADDED
            onScroll={onScroll} // ★ ADDED
            sx={{ height: "100%", overflow: "scroll" }}
          >
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
          </Box>

          {/* ★ CHANGED — top edge indicator: line + a separate gradient
              "shadow" fading downward beneath it, more visible than relying
              on box-shadow blur alone */}
          {canScrollUp && (
            <>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  backgroundColor: "var(--light-brown)",
                  opacity: 0.5,
                  pointerEvents: "none",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "1px",
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(to bottom, rgba(43, 51, 40, 0.08), rgba(43, 51, 40, 0))",
                  pointerEvents: "none",
                }}
              />
            </>
          )}

          {/* ★ CHANGED — bottom edge indicator: same treatment, mirrored,
              shadow fading upward above the line */}
          {canScrollDown && (
            <>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  backgroundColor: "var(--light-brown)",
                  opacity: 0.5,
                  pointerEvents: "none",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: "1px",
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(to top, rgba(43, 51, 40, 0.08), rgba(43, 51, 40, 0))",
                  pointerEvents: "none",
                }}
              />
            </>
          )}
        </Box>
        
        <Box sx={{height: "4px"}} />
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
            <IconButton onClick={handleSave} sx={{ p: 0.5, color: "var(--red)", flexShrink: 0 }}>
              <CheckIcon sx={{ fontSize: "18px" }} />
            </IconButton>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", pl: 0.8 }}>
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
    </Stack>
  );
}