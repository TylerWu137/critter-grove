import {Stack, Box, Typography, TextField} from "@mui/material";
import { useState } from "react";

import PlayerTopBar from "../components/PlayerTopBar/PlayerTopBar"
import NavBar from "../components/common/NavBar";
import HelpButton from "../components/common/HelpButton"
import AddQuestPopover from "../components/quests/AddQuestPopover"
import QuestsSection from "../components/quests/QuestsSection"

export default function QuestsScreen() {
  const [search, setSearch] = useState("");

  return (
    <Stack sx={{height: "100%", boxSizing: "border-box"}}>
      <PlayerTopBar sx={{pt: 4, pb: 2, pl: 4, pr: 4, backgroundColor: "var(--green)"}}/>
      <Stack spacing={2} sx={{pt: 4, pb: 2, pl: 4, pr: 4, borderTop: "2px solid var(--brown)", flex: 100, minHeight: 0, backgroundColor: "var(--cream)"}}>
        {/* ★ CHANGED — added minHeight: 0 here */}
        <Stack direction="row" sx={{width: "100%"}}>
          <Typography variant="h2" sx={{flex: 1, color: "var(--red)"}}>Quests</Typography>
          <Stack direction="row" spacing={2} sx={{flex: 5, justifyContent: "center"}}>
            <AddQuestPopover />
            <TextField 
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                width: "33%"
              }}
            />
          </Stack>
          <HelpButton sx={{flex: 1}}/>
        </Stack>
        <Stack sx={{flex: 1, minHeight: 0, width: "100%", alignItems: "center"}}>
          {/* ★ CHANGED — added minHeight: 0 here — this is the direct parent
              controlling QuestsSection's available height, so it was the
              most important missing piece */}
          <Stack direction="row" spacing={3} sx={{flex: 1, minHeight: 0, alignItems: "stretch", width: "80%"}}>
            {/* ★ CHANGED — added minHeight: 0; also changed alignItems from
                "center" to "stretch" — "center" was letting each QuestsSection
                shrink to its own content height instead of filling the row,
                which independently would have caused growing/no-scroll too */}
            <QuestsSection section={"daily"} search={search} />
            <QuestsSection section={"epic"} search={search} />
            <QuestsSection section={"side"} search={search} />
          </Stack>
          <NavBar/>
        </Stack>
      </Stack>
    </Stack>
  );
}