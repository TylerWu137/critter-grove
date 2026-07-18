import {Stack, Box, Typography } from "@mui/material";

import { useQuests } from "../../context/QuestsContext";
import QuestCard from "./QuestCard"

export default function QuestsSection({section, search = ""}) {
  const { getQuestsByType } = useQuests();
  const sectionQuests = getQuestsByType(section).filter((quest) =>
    quest.name.toLowerCase().includes(search.toLowerCase())
  ); // ★ CHANGED — added search filtering, applied after the incomplete/completed split

  return (
    <Stack spacing={1} sx={{flex: 1, height: "100%"}}>
      <Typography variant="h23" sx={{pl: 2, textTransform: "capitalize", color: "var(--brown)"}}>{section} Quests</Typography>
      <Box sx={{ borderRadius: 4, height: "100%", minHeight: 0, border: "2px solid var(--brown)", overflow: "hidden" }}>
        <Stack
          spacing={2}
          sx={{
            height: "100%",
            width: "auto",
            minHeight: 0,
            p: 1,
            pl: 2,
            mr: -0.5,
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
              width: 10,
              borderColor: "var(--brown)",
              borderWidth: 100,
            },

            "&::-webkit-scrollbar-track": {
              backgroundColor: "var(--cream)",
              border: "2px solid var(--brown)",
            },

            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "var(--red)",
              border: "2px solid transparent",
              backgroundClip: "padding-box",
              borderRadius: 999
            },
          }}
        >
          {/* ★ CHANGED — was 9 hardcoded <QuestCard quest={{name: "quest N"}}/> lines */}
          {sectionQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
          {/* ★ ADDED — guarantees room for the last card to fully scroll
              into view; overflow:hidden on the outer Box + the negative
              mr trick can otherwise clip the last few pixels */}
          <Box sx={{ flexShrink: 0, height: 8 }} />
        </Stack>
      </Box>
    </Stack>
  );
}