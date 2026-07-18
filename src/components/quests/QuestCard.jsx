import {Stack, Box, Typography, IconButton } from "@mui/material";

import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function QuestCard({quest}) {
  return (
    <Stack direction="row" spacing={1} sx={{alignItems: "center", width: "auto"}}>
      <RadioButtonUncheckedIcon sx={{fontSize: "small", color: "var(--brown)"}}/>
      <Stack direction="row" spacing={1} sx={{flex: 1, p: 1, alignItems: "center", border: "1px solid var(--brown)", borderRadius: 2}}>
        <Typography variant="body2" sx={{color: "var(--brown)"}}>{quest.name}</Typography>
        <Box sx={{flex: 1}}/>
        <IconButton sx={{p: 0.1, borderRadius: 100, color: "var(--brown)",
                transition: "color 200ms ease",
                "&:hover": {
                    color: "var(--cream)",
                    backgroundColor: "var(--light-brown)"
                }
            }}>
            <TaskAltIcon sx={{fontSize: "small"}}/>
        </IconButton>
        <IconButton sx={{p: 0.1, borderRadius: 100, color: "var(--brown)",
                transition: "color 200ms ease",
                "&:hover": {
                    color: "var(--cream)",
                    backgroundColor: "var(--light-brown)"
                }
            }}>
            <MoreVertIcon sx={{fontSize: "small"}}/>
        </IconButton>
        
      </Stack>
    </Stack>
  );
}