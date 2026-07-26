import { Box } from "@mui/material";
import PetsIcon from '@mui/icons-material/Pets';

export default function CritterSelectBox({ selected, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        flex: 1,
        aspectRatio: "1 / 1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 2,
        cursor: "pointer",
        boxSizing: "border-box",
        transition: "border-color 150ms ease, transform 150ms ease, background-color 150ms ease",
        border: selected ? "3px solid var(--red)" : "2px dashed var(--light-brown)",
        backgroundColor: selected ? "rgba(232, 140, 125, 0.15)" : "rgba(255,255,255,0.06)",
        transform: selected ? "scale(1.05)" : "scale(1)",
        "&:hover": {
          borderColor: "var(--red)",
        },
      }}
    >
      <PetsIcon
        sx={{
          fontSize: 22,
          color: selected ? "var(--red)" : "var(--light-brown)",
          opacity: selected ? 1 : 0.6,
        }}
      />
    </Box>
  );
}