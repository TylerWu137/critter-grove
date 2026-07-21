import {Stack, Box, Typography, LinearProgress, linearProgressClasses} from "@mui/material";

export default function UserProfile({ name, currentXp, level }) {
  const xpForNextLevel = 10 * level;
  const progress = Math.min((currentXp / xpForNextLevel) * 100, 100);
  return (
    <Box
      sx={{
        position: "absolute",
        width: "25%",
        height: "20%",
        left: "5%"
      }}
    >
      {/* Rectangle */}
      <Box
        sx={{
          bgcolor: "var(--cream)",
          border: 2,
          borderColor: "var(--brown)",
          borderRadius: 2,
          pl: "20%",
          pt: "1.5%",
          pr: "5%",
          pb: "1.5%"
        }}
      >
        <Stack sx={{height: "95%" }}>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "baseline", gap: 3 }}>
              <Typography variant="h3" sx={{ color: "var(--brown)" }}>{name}</Typography>
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
              <Typography variant="body3" sx={{color: "var(--red)"}}>{currentXp}</Typography>
              <Typography variant="body3" sx={{ color: "var(--brown)" }}>
                / {xpForNextLevel} XP
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Circle */}
      <Box
        sx={{
          position: "absolute",
          top: "0",
          left: "-12.5%",

          width: "25%",
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