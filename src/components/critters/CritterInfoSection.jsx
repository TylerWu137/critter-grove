import { Stack, Typography, Button, Box, LinearProgress, linearProgressClasses } from "@mui/material";

import { useCritters } from "./CrittersContext";

export default function CritterInfoSection() {
  const { selectedCritter, feedCritter } = useCritters();
  
  const xpForNextLevel = 10 * selectedCritter.level;
  const progress = Math.min((selectedCritter.xp / xpForNextLevel) * 100, 100);

  if (!selectedCritter) return null;

  return (
    <Stack spacing={2} sx={{flex: 1, minHeight: 0, width: "100%", px: 1}}>
      <Stack sx={{width: "50%"}}>
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "baseline", gap: 3 }}>
          <Typography variant="h3" sx={{ color: "var(--brown)" }}>{selectedCritter.name}</Typography>
          <Typography variant="body1" sx={{ color: "var(--brown)" }}>Lv. {selectedCritter.level}</Typography>
        </Box>
        <Box sx={{flex: 1}}/>
        <Stack direction="row" spacing={3} sx={{ width: "100%", alignItems: "center" }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "rgba(0,0,0,0.1)",
              flex: 1,
              [`& .${linearProgressClasses.bar}`]: {
                borderRadius: 5,
                backgroundColor: "var(--red)",
              },
            }}
          />
          <Stack direction="row" spacing={0.5}>
            <Typography variant="body2" sx={{color: "var(--red)"}}>{selectedCritter.xp}</Typography>
            <Typography variant="body2" sx={{ color: "var(--brown)" }}>
              / {xpForNextLevel} XP
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack spacing={2} direction="row">
        <Box sx={{flex: 1, height: "200px", border: 1}}>image</Box>
        <Stack sx={{flex: 1, p: 3, justifyContent: "center"}}>
          <Typography variant="body2" sx={{color: "var(--brown)"}}>Pellentesque vitae consequat diam. Donec sit amet purus sed augue congue gravida id et diam.</Typography>
          <Stack direction="row" sx={{mt: 2, mb: 1, width: "100%", alignSelf: "center"}}>
            <Button variant="action" sx={{flex: 1,}}
              onClick = {() => feedCritter(selectedCritter, 10)}
            >
              <Typography sx={{m: 0}}>Feed{"\u00A0\u00A0\u00A0"}</Typography>
              <Typography variant="xs" sx={{position: "absolute",
                top: 1,
                right: 2, m: 0}}>
                {"\u00A0"}(+10 XP)
              </Typography>
            </Button>
            <Box sx={{flex: 0.2}}/>
            <Button variant="action" sx={{flex: 1}}><Typography>Add</Typography></Button>
          </Stack>
          <Button variant="action" sx={{flex: 1, width: "50%", alignSelf: "center"}}><Typography>Release</Typography></Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
/*
import {Stack, Box, Typography, LinearProgress, linearProgressClasses} from "@mui/material";

export default function UserProfile({ username, selectedCritter.xp, level }) {
  const xpForNextLevel = 10 * level;
  const progress = Math.min((selectedCritter.xp / xpForNextLevel) * 100, 100);
  return (
    <Box
      sx={{
        position: "absolute",
        width: "25%",
        height: "50%",
        left: "5%"
      }}
    >
      <Box
        sx={{
          bgcolor: "var(--cream)",
          border: 2,
          borderColor: "var(--brown)",
          borderRadius: 2,
          pl: "20%",
          pt: "3%",
          pr: "5%",
          pb: "3%"
        }}
      >
        <Stack sx={{height: "92%" }}>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "baseline", gap: 3 }}>
              <Typography variant="h3" sx={{ color: "var(--brown)" }}>{username}</Typography>
              <Typography variant="body1" sx={{ color: "var(--brown)" }}>Lv. {level}</Typography>
          </Box>
          <Box sx={{flex: 1}}/>
          <Stack direction="row" spacing={3} sx={{ width: "100%", alignItems: "center" }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "rgba(0,0,0,0.1)",
                flex: 1,
                [`& .${linearProgressClasses.bar}`]: {
                  borderRadius: 5,
                  backgroundColor: "var(--red)",
                },
              }}
            />
            <Stack direction="row" spacing={0.5}>
              <Typography variant="body2" sx={{color: "var(--red)"}}>{selectedCritter.xp}</Typography>
              <Typography variant="body2" sx={{ color: "var(--brown)" }}>
                / {xpForNextLevel} XP
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: "0",
          left: "-15%",

          width: "30%",
          aspectRatio: "1 / 1",
          borderRadius: "50%",

          bgcolor: "var(--cream)",
          border: 2,
          borderColor: "var(--brown)",
          
        }}
      />
    </Box>
  )
};
*/