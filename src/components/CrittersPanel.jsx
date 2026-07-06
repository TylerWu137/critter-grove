import {Stack, Box, Collapse, Button, Typography} from "@mui/material";

export default function CrittersPanel({ setActivePanel }) {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        backgroundColor: "var(--cream)",
        boxSizing: "border-box",
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        pt: 4,
        pb: 2,
        pl: 4,
        pr: 4,
      }}
    >
      <Stack spacing={4} sx={{height: "100%", width: "100%", alignItems: "center"}}>
        <Stack direction="row" sx={{width: "100%"}}>
          <Typography variant="h2" sx={{color: "var(--red)"}}>Critters</Typography>
          <Box sx={{flex: 1}}/>
          <Box sx={{height: 1, aspectRatio: "1 / 1", border: 1}}>?</Box>
        </Stack>
        <Box sx={{height: "30%", width: "50%", border: 1}}/>
        <Typography variant="body1">Vestibulum elementum, nibh nec tristique ullamcorper, magna sem ultrices tortor, id accumsan eros dui eu purus. Aliquam nisl lacus, sagittis sit amet augue in, tincidunt accumsa</Typography>
        <Button variant="menu" sx={{width: "40%"}}><Typography variant="h3">Companions</Typography></Button>
        <Button variant="menu" sx={{width: "40%"}}><Typography variant="h3">CritterDex</Typography></Button>
        <Box sx={{flex: 1}}/>
        <Button
          variant="menu"
          sx={{
            alignSelf: "flex-start",
          }}
          onClick={() => setActivePanel(null)}
        >
          <Typography variant="h4">
            Close
          </Typography>
        </Button>
      </Stack>
    </Box>
  );
}