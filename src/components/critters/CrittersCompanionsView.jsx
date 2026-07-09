import {Stack, Box, Button, Typography} from "@mui/material";
import MyCompanionsSection from "./MyCompanionsSection"
import MyCrittersSection from "./MyCrittersSection"

export default function CrittersMenuView({  }) {
  return (
    <Stack spacing={2} sx={{width: "100%", height: "100%", overflow: "hidden"}}>
      <MyCompanionsSection />
      <Box
        sx={{
          height: 2,
          backgroundColor: "var(--brown)",
          borderRadius: "999px",
        }}
      />
      <MyCrittersSection />
    </Stack>
  )
};
  