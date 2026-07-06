import {Stack, Box, Collapse, Button, Typography} from "@mui/material";

export default function ShopPanel({ activePanel, setActivePanel }) {

  return (
    <Box>ShopPanel
      <Button
        variant="menu2"
        sx={{height:"100%"}}
        onClick={() => {setActivePanel(null);}}
      >
        <Typography variant="h4">Close</Typography>
      </Button>
    </Box>
  );
}