import { useState } from "react";
import {
  Popover,
  Stack,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";

import { useQuests } from "../../context/QuestsContext";
import AddButton from "../common/AddButton";

export default function AddQuestPopover() {
  const { questTags, addQuest } = useQuests();

  const [anchorEl, setAnchorEl] = useState(null);
  const [type, setType] = useState("daily");
  const [name, setName] = useState("");
  const [tagId, setTagId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const open = Boolean(anchorEl);
  const isDaily = type === "daily"; // ★ ADDED

  const handleOpen = (e) => setAnchorEl(e.currentTarget);

  // ★ ADDED — clears date/time if switching to "daily", so a previously
  // entered value can't be silently submitted while the fields are disabled
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
    if (newType === "daily") {
      setDate("");
      setTime("");
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    // reset the form for next time
    setType("daily");
    setName("");
    setTagId("");
    setDate("");
    setTime("");
  };

  const handleCreate = () => {
    if (!name.trim()) return; // require at least a description

    addQuest({
      type,
      name: name.trim(),
      tagId: tagId === "" ? null : tagId,
      date: date === "" ? null : date,
      time: time === "" ? null : time,
    });

    handleClose();
  };

  return (
    <>
      <AddButton onClick={handleOpen} />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5, // room for the triangle pointer
              width: "30vw", // ★ ADDED — constrains the actual popover box itself
              maxWidth: "30vw", // ★ ADDED — belt-and-suspenders in case something else sets a competing max-width
              overflow: "visible",
              borderRadius: 3,
              border: "2px solid var(--brown)",
              backgroundColor: "var(--cream)",
              p: 2,
              boxSizing: "border-box", // ★ ADDED — so padding doesn't push the box past 40vw
              position: "relative",
              // ★ the speech-bubble pointer — a rotated square peeking out
              // of the top edge, colored to match the popover body
              "&::before": {
                content: '""',
                position: "absolute",
                top: -9,
                left: "50%",
                transform: "translateX(-50%) rotate(45deg)",
                width: 16,
                height: 16,
                backgroundColor: "var(--cream)",
                borderTop: "2px solid var(--brown)",
                borderLeft: "2px solid var(--brown)",
              },
            },
          },
        }}
      >
        <Stack spacing={1.5} sx={{ width: "100%" }}>
          {/* ★ CHANGED — was width: "40vw" here; the width constraint now
              lives on the Paper itself (slotProps.paper.sx above), so this
              just fills whatever width the Paper ends up being */}

          {/* row 1 — type, description, create */}
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Select
              value={type}
              onChange={handleTypeChange}
              size="small"
              sx={{
                minWidth: 90,
                height: 36, // ★ ADDED — matches description field / Create button height
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                flex: 1,
                minWidth: 0,
                "& .MuiInput-root": {
                  fontWeight: 400,
                  color: "var(--brown)",
                },
                "& .MuiInput-input::placeholder": {
                  color: "var(--light-brown)",
                  opacity: 1,
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "var(--light-brown)",
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottomColor: "var(--brown)",
                },
                "& .MuiInput-underline:after": {
                  borderBottomColor: "var(--brown)",
                },
              }}
            />

            <Button
              onClick={handleCreate}
              variant="menu2"
              sx={{
                fontWeight: 500,
                flexShrink: 0,
                "&:hover": {
                  color: "var(--red)",
                  borderColor: "var(--red)"
                }
              }}
            >
              <Typography variant="text" component="span" sx={{ fontWeight: 500 }}>
                Create
              </Typography>
            </Button>
          </Stack>

          {/* row 2 — tag, date, time */}
          <Stack direction="row" spacing={1}>
            <Select
              value={tagId}
              onChange={(e) => setTagId(e.target.value)}
              displayEmpty
              size="small"
              sx={{
                flex: 1,
                minWidth: 0,
                height: 36, // ★ ADDED — matches date/time TextField height directly, instead of relying on padding alone
                color: "var(--brown)",
                "& .MuiSelect-select": {
                  paddingTop: "4px !important", // ★ CHANGED — !important since a more specific default MUI rule was likely winning before
                  paddingBottom: "4px !important",
                  minHeight: "unset !important", // ★ ADDED — MUI sets its own minHeight on this element; without overriding it, padding alone can't shrink it further
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <MenuItem value="" sx={{ textTransform: "capitalize" }}>
                <Typography variant="text" component="span">No tag</Typography>
              </MenuItem>
              {questTags.map((tag) => (
                <MenuItem key={tag.id} value={tag.id} sx={{ textTransform: "capitalize" }}>
                  <Typography variant="text" component="span">{tag.name}</Typography>
                </MenuItem>
              ))}
            </Select>

            {/* ★ CHANGED — removed the per-field ".Mui-disabled:hover" override;
                this is now handled globally in theme.js's MuiOutlinedInput */}
            <TextField
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              size="small"
              disabled={isDaily}
              sx={{ flex: 1, minWidth: 0, opacity: isDaily ? 0.4 : 1 }}
            />

            <TextField
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              size="small"
              disabled={isDaily}
              sx={{ flex: 1, minWidth: 0, opacity: isDaily ? 0.4 : 1 }}
            />
          </Stack>
        </Stack>
      </Popover>
    </>
  );
}