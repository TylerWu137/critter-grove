import { Box } from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';

export default function ArtworkPlaceholder({ sx }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px dashed var(--light-brown)",
        borderRadius: 3,
        backgroundColor: "rgba(255,255,255,0.08)",
        boxSizing: "border-box",
        ...sx,
      }}
    >
      <ImageIcon sx={{ fontSize: 48, color: "var(--light-brown)", opacity: 0.6 }} />
    </Box>
  );
}