import {Stack, Box, Typography, IconButton, Paper } from "@mui/material";

import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useQuests } from "../../context/QuestsContext"; // ★ ADDED

export default function QuestCard({quest}) {
  const { toggleQuestCompletion, getTagById } = useQuests(); // ★ ADDED

  // ★ ADDED — available for you to use however you'd like when you build
  // out the rest of the card's display (tag color, date, time, etc)
  const tag = quest.tagId ? getTagById(quest.tagId) : null;
  // tag?.name, tag?.color, quest.date, quest.time, quest.isCompleted
  // are all already on hand here, just not rendered yet

  return (
    <Stack direction="row" spacing={1} sx={{alignItems: "center", width: "auto"}}>
      {/* ★ CHANGED — wired up as the completion toggle; swaps icon based on quest.isCompleted */}
      <IconButton
        onClick={() => toggleQuestCompletion(quest.id)}
        sx={{ p: 0 }}
      >
        {quest.isCompleted ? (
          <TaskAltIcon sx={{fontSize: "medium", color: "var(--brown)"}}/>
        ) : (
          <RadioButtonUncheckedIcon sx={{fontSize: "medium", color: "var(--brown)"}}/>
        )}
      </IconButton>
      <Stack direction="row" spacing={1} sx={{flex: 1, px: 1, py: 1.5, alignItems: "center", border: "1px solid var(--brown)", borderRadius: 2}}>
        <Typography
          variant="text"
          sx={{
            color: "var(--brown)",
            textDecoration: quest.isCompleted ? "line-through" : "none",
          }}
        >
          {quest.name}
        </Typography>
        <Box sx={{flex: 1}}/>
        <IconButton sx={{p: 0.1, borderRadius: 100, color: "var(--brown)",
                transition: "color 200ms ease",
                "&:hover": {
                    color: "var(--cream)",
                    backgroundColor: "var(--light-brown)"
                }
            }}>
            <MoreVertIcon sx={{fontSize: "18px"}}/>
        </IconButton>
        
      </Stack>
    </Stack>
  );
}