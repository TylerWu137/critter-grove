import { Box } from "@mui/material";
import InProgressPlaceholder from "./common/InProgressPlaceholder"; // ★ ADDED — adjust path if TodayUpdates lives elsewhere relative to common/

export default function TodayUpdates({ sx }) {
  return (
    <Box sx={sx}>
      <InProgressPlaceholder label="Today's Updates" />
    </Box>
  );
}