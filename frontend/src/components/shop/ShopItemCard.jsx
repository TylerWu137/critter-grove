import { Stack, Box, Typography } from "@mui/material";
import { useRef } from "react";

export default function ShopItemCard({ sx, item, onClick }) {

  return (
    <Stack
      sx={{
        alignItems: "center",
        px: 3, py: 1,
        mx: "auto",
        borderRadius: 4,
        "&:hover": { backgroundColor: "var(--dark-highlight)" },
        border: "2px solid var(--light-brown)",
        cursor: "pointer",
        ...sx,
      }}
    >
      <Stack direction="row" spacing={0.5} sx={{ alignSelf: "flex-end", alignItems: "center"}}>
        <Typography variant="body2" sx={{ color: "var(--brown)", textAlign: "right" }}>{item.price}</Typography>
        <Box sx={{ height: "15px", width: "15px", border: 1 }}></Box>
      </Stack>
      <Box sx={{ height: "75px", width: "75px", border: 1 }}>image</Box>
      <Typography variant="h34" 
        sx={{ 
          height: "60px", 
          color: "var(--brown)", 
          textAlign: "center", display: "flex", alignItems: "center", 
        }}
      >
        {item.name}
      </Typography>
    </Stack>
  );
}