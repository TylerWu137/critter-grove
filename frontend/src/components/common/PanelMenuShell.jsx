import {Stack, Box, Button, Typography} from "@mui/material";

export default function PanelMenuShell({ setView, description, section1, section2 }) {
  return (
    <>
      <Box sx={{flex: 0 }}/>
      <Stack spacing={4} sx={{width: "100%", alignItems: "center"}}>
        <Box sx={{height: "200px", width: "50%", border: 1}}/>
        <Typography variant="body1">{description}</Typography>
        <Button variant="menu" sx={{width: "40%"}}
          onClick={() => setView(section1.toLowerCase())}
        ><Typography variant="h3">{section1}</Typography></Button>
        <Button variant="menu" sx={{width: "40%"}}
          onClick={() => setView(section2.toLowerCase())}
        ><Typography variant="h3">{section2}</Typography></Button>
      </Stack>
  </>
  )
};
  