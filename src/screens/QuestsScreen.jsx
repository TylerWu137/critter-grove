import {Stack, Box, Typography, TextField} from "@mui/material";

import PlayerTopBar from "../components/PlayerTopBar/PlayerTopBar"
import NavBar from "../components/common/NavBar";
import HelpButton from "../components/common/HelpButton"
import AddButton from "../components/common/AddButton"

export default function QuestsScreen() {
  return (
    <Stack sx={{height: "100%", boxSizing: "border-box"}}>
      <PlayerTopBar sx={{pt: 4, pb: 2, pl: 4, pr: 4, backgroundColor: "var(--green)"}}/>
      <Stack sx={{pt: 4, pb: 2, pl: 4, pr: 4, borderTop: "2px solid var(--brown)", flex: 100, backgroundColor: "var(--cream)"}}>
        <Stack direction="row">
          <Typography variant="h2" sx={{color: "var(--red)"}}>Quests</Typography>
          <Stack direction="row" spacing={2} sx={{flex: 5, justifyContent: "center"}}>
            <AddButton />
            <TextField />
          </Stack>
          <HelpButton sx={{flex: 1}}/>
        </Stack>
        <Stack direction="row">

        </Stack>
        <NavBar/>
      </Stack>
    </Stack>
  );
}