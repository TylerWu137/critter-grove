import { Button, Typography, Stack } from "@mui/material";
import { useState } from "react";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

import { CrittersProvider, useCritters } from "./CrittersContext";
import PanelMenuShell from "../common/PanelMenuShell"
import CrittersCompanionsView from "./CrittersCompanionsView"
import CrittersCritterDexView from "./CrittersCritterDexView"
import PickCompanionBackdrop from "./PickCompanionBackdrop"
import ReleaseConfirmModal from "./ReleaseConfirmModal"
import PanelShell from "../common/PanelShell" // ★ CHANGED — was importing HelpButton directly; that now lives inside PanelShell

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
        return <PanelMenuShell setView={setView} 
          description={"Vestibulum elementum, nibh nec tristique ullamcorper, magna sem ultrices tortor, id accumsan eros dui eu purus. Aliquam nisl lacus, sagittis sit amet augue in, tincidunt accumsa"}
          section1={"Companions"}
          section2={"CritterDex"}
        />;
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
        return null; // ★ CHANGED — was bare `return`; null is the explicit "render nothing" value for a slot prop
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
    if (view === "companions" && selectedCritter) {
      clickFunction = () => setSelectedCritter(null);
      text = "Back";
    } else if (view === "critters") {
      clickFunction = () => setActivePanel(null);
      text = "Close";
    } else {
      clickFunction = () => setView("critters");
      text = "Back";
    }

    return (
      <Button variant="menu" onClick={clickFunction}>
        <Typography variant="h3">{text}</Typography>
      </Button>
    );
  }

  return (
    <>
      <PanelShell
        title={capitalize(view)}
        footerLeft={closeButton()}
        footerRight={redirectButton()}
      >
        {viewComponent()}
      </PanelShell>

      <PickCompanionBackdrop />
      <ReleaseConfirmModal />
    </>
  );
}