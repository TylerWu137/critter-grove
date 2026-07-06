import {Stack, Box, Collapse} from "@mui/material";
import { useState } from "react";

import UserProfile from "../components/UserProfile";
import Currencies from "../components/Currencies";
import TodayUpdates from "../components/TodayUpdates";
import NavBar from "../components/NavBar";
import CrittersPanel from "../components/CrittersPanel";
import ShopPanel from "../components/ShopPanel";


export default function HomeScreen() {
  const [activePanel, setActivePanel] = useState(null);

  return (
    <Box sx={{pt: 4, pb: 2, pl: 4, pr: 4, height: "100%", boxSizing: "border-box", backgroundColor: "var(--green)"}}>
      <Stack direction="row" sx={{height: "1"}}>
        <Stack sx={{height: "1", width: "1"}}>
          <Stack direction="row" sx={{flex: 2}}>
            <UserProfile username={"Little Dragon"} currentXp={80} xpForNextLevel={100} level={18}/>
            <Box sx={{flex: 1}}/>
            <Currencies acornAmt={"125"} treatAmt={"27,232,293"} flowerAmt={"8"} activePanel={activePanel} />
          </Stack>
          <TodayUpdates sx={{flex: 6}}/>
          <NavBar activePanel={activePanel} setActivePanel={setActivePanel} />
        </Stack>
        <Collapse
          in={activePanel === "critters"}
          orientation="horizontal"
          mountOnEnter
          unmountOnExit
        >
          <CrittersPanel activePanel={activePanel} setActivePanel={setActivePanel} />
        </Collapse>
        <Collapse
          in={activePanel === "shop"}
          orientation="horizontal"
          mountOnEnter
          unmountOnExit
        >
          <ShopPanel activePanel={activePanel} setActivePanel={setActivePanel} />
        </Collapse>
      </Stack>
    </Box>
  );
}