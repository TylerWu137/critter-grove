import { Typography } from "@mui/material";

import { useCritters } from "./CrittersContext";
import FullScreenBackdrop from "../common/FullScreenBackdrop";

export default function PickCompanionBackdrop() {
  const { pickingCompanion, cancelAddCompanion } = useCritters();

  return (
    <FullScreenBackdrop open={pickingCompanion} onClick={cancelAddCompanion}>
      <Typography
        variant="h4"
        sx={{
          color: "var(--cream)",
          position: "absolute",
          top: "8%",
          width: "100%",
          textAlign: "center",
          px: 2,
        }}
      >
        Choose a companion to swap
      </Typography>
    </FullScreenBackdrop>
  );
}