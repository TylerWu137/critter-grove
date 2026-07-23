import { Box, Popover, IconButton } from "@mui/material";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";

export default function ColorPicker({ color, setColor }) {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Box
          sx={{
            width: 15,
            aspectRatio: "1 / 1",
            bgcolor: color,
            border: "1px solid var(--brown)",
            borderRadius: 1,
          }}
        />
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <HexColorPicker color={color} onChange={setColor} />
      </Popover>
    </>
  );
}