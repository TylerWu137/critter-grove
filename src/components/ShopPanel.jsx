import {Stack, Box, Collapse, Button, Typography} from "@mui/material";

export default function ShopPanel({ activePanel, setActivePanel }) {

  return (
    <Box sx={{border: 1}}>ShopPanel
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