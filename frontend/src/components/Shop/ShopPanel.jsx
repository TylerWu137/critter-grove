import { Button, Typography, Stack } from "@mui/material";
import { useState } from "react";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

import PanelShell from "../common/PanelShell";
import PanelMenuShell from "../common/PanelMenuShell";
import ShopView from "./ShopView"

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

export default function ShopPanel({ setActivePanel }) {
  const [view, setView] = useState("shop");

  const viewComponent = () => {
    switch (view) {
      case "shop":
        // no separate "ShopMenuView.jsx" needed — PanelMenuShell is
        // already fully generic, same as how CrittersPanel reuses it
        // inline for its own landing case
        return (
          <PanelMenuShell
            setView={setView}
            description={"Spend your acorns, treats, and flowers on new critters and cozy decorations for your space."}
            section1={"Critters"}
            section2={"Decor"}
          />
        );
      case "critters":
        return <ShopView category={"critters"} />;
      case "decor":
        return <ShopView category={"decor"} />;
    }
  };

  const redirectButton = () => {
    let otherView, section;
    switch (view) {
      case "critters":
        otherView = "decor"; section = "Decor";
        break;
      case "decor":
        otherView = "critters"; section = "Critters";
        break;
      case "shop":
        return null;
    }
    return <></>
    return (
      <Button
        onClick={() => setView(otherView)}
        sx={{
          backgroundColor: "transparent",
          "&:hover": { backgroundColor: "transparent" },
        }}
      >
        <Stack>
          <Typography variant="h4" sx={{ color: "var(--red)" }}>{section}</Typography>
          <ArrowRightAltIcon sx={{ color: "var(--red)", alignSelf: "flex-end"}} />
        </Stack>
      </Button>
    );
  };

  const closeButton = () => {
    let clickFunction, text;
    if (view === "shop") {
      clickFunction = () => setActivePanel(null);
      text = "Close";
    } else {
      clickFunction = () => setView("shop");
      text = "Back";
    }
    return (
      <Button variant="menu" onClick={clickFunction}>
        <Typography variant="h3">{text}</Typography>
      </Button>
    );
  };

  return (
    <PanelShell
      title={capitalize(view)}
      footerLeft={closeButton()}
      footerRight={redirectButton()}
    >
      {viewComponent()}
    </PanelShell>
  );
}