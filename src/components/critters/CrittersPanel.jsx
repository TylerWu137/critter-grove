import { Stack, Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

import { CrittersProvider, useCritters } from "./CrittersContext";
import CrittersMenuView from "./CrittersMenuView"
import CrittersCompanionsView from "./CrittersCompanionsView"
import CrittersCritterDexView from "./CrittersCritterDexView"
import PickCompanionBackdrop from "./PickCompanionBackdrop"
import ReleaseConfirmModal from "./ReleaseConfirmModal"

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

export default function CrittersPanel({ setActivePanel }) {
  return (
    <CrittersProvider>
      <CrittersPanelContent setActivePanel={setActivePanel} />
    </CrittersProvider>
  );
}

function CrittersPanelContent({ setActivePanel }) {
  const [view, setView] = useState("critters");
  const { selectedCritter, setSelectedCritter } = useCritters();

  const viewComponent = () => {
    switch (view) {
      case "critters":
        return <CrittersMenuView view={view} setView={setView}/>;
      case "companions":
        return <CrittersCompanionsView />;
      case "critterdex":
        return <CrittersCritterDexView />;
    }
  }

  const redirectButton = () => {
    let otherView, section;
    switch (view) {
      case "companions":
        otherView = "critterdex"; section = "CritterDex";
        break;
      case "critterdex":
        otherView = "companions"; section = "Companions";
        break;
      case "critters":
        return
    }
    return (
      <Button onClick={() => setView(otherView)} 
        sx={{
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
      >
        <Stack>
          <Typography variant="h4" sx={{color: "var(--red)"}}>{section}</Typography>
          <ArrowRightAltIcon sx={{ color: "var(--red)", alignSelf: "flex-end"}} />
        </Stack>
      </Button>
    );
  }

  const closeButton = () => {
    let clickFunction, text;
    console.log({ view, selectedCritter });
    if (view === "companions" && selectedCritter) {
      // on CritterInfoSection -> go back to the critters/companions list
      clickFunction = () => setSelectedCritter(null);
      text = "Back";
    } else if (view === "critters") {
      // on the base landing menu -> close the whole panel
      clickFunction = () => setActivePanel(null);
      text = "Close";
    } else {
      // on companions/critterdex (no selection) -> go back to menu
      clickFunction = () => setView("critters");
      text = "Back";
    }

    return (
      <Button
            variant="menu"
            onClick={clickFunction}
          >
            <Typography variant="h3">
              {text}
            </Typography>
          </Button>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        backgroundColor: "var(--cream)",
        boxSizing: "border-box",
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        pt: 4,
        pb: 2,
        pl: 4,
        pr: 4,
      }}
    >
      <Stack spacing={4} sx={{height: "100%", width: "100%", alignItems: "center"}}>
        <Stack direction="row" sx={{width: "100%"}}>
          <Typography variant="h2" sx={{color: "var(--red)"}}>{capitalize(view)}</Typography>
          <Box sx={{flex: 1}}/>
          <Box sx={{height: 1, aspectRatio: "1 / 1", border: 1}}>?</Box>
        </Stack>

        <Box sx={{display: "flex", flex: 1, overflow: "hidden", width: "100%"}}>
          {viewComponent()}
        </Box>

        <Stack direction="row" sx={{width: "100%", alignItems: "flex-end"}}>
          {closeButton()}
          <Box sx={{flex: 1}}/>
          {redirectButton()}
        </Stack>
      </Stack>
      <PickCompanionBackdrop />
      <ReleaseConfirmModal />
    </Box>
  );
}