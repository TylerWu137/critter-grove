import { Stack, Box } from "@mui/material";
import { DragOverlay } from "@dnd-kit/core";

import { useCritters } from "./CrittersContext";
import MyCompanionsSection from "./MyCompanionsSection";
import MyCrittersSection from "./MyCrittersSection";
import CritterInfoSection from "./CritterInfoSection";
import CritterCard from "./CritterCard";

export default function CrittersCompanionsView() {
  const { activeCritter, selectedCritter } = useCritters();

  return (
    <>
      <Stack spacing={1.5} sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <MyCompanionsSection />
        <Box sx={{ height: 2, backgroundColor: "var(--brown)", borderRadius: "999px" }} />
        {selectedCritter ? (
          <CritterInfoSection />
        ) : (
          <MyCrittersSection />
        )}
      </Stack>

      <DragOverlay dropAnimation={null}>
        {activeCritter ? (
          <CritterCard name={activeCritter.name} level={activeCritter.level} />
        ) : null}
      </DragOverlay>
    </>
  );
}