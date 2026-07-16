import {Stack, Box, Collapse} from "@mui/material";
import { useState } from "react";

import PlayerTopBar from "../components/PlayerTopBar/PlayerTopBar";
import TodayUpdates from "../components/TodayUpdates";
import NavBar from "../components/NavBar";
import CrittersPanel from "../components/critters/CrittersPanel";
import ShopPanel from "../components/ShopPanel";


export default function HomeScreen() {
  const [activePanel, setActivePanel] = useState(null);

  return (
    <Box sx={{ height: "100%", width: "100%", backgroundColor: "var(--green)"}}>
      <Stack
        direction="row"
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        <Box
          sx={{
            pt: 4,
            pb: 2,
            pl: 4,
            pr: 4,
            height: "100%",
            flex: 1,
            boxSizing: "border-box",
          }}
        >
          <Stack sx={{ height: "100%" }}>
            <PlayerTopBar sx={{flex: 2}} activePanel = {activePanel} />

            <TodayUpdates sx={{ flex: 6 }} />

            <Stack sx={{flex: 2}}>
              <Box sx={{flex: 1}}/>
              <NavBar
                activePanel={activePanel}
                setActivePanel={setActivePanel}
              />
            </Stack>
          </Stack>
        </Box>

        <Collapse
          in={activePanel === "critters"}
          orientation="horizontal"
          mountOnEnter
          unmountOnExit
          sx={{
            height: "100%",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: "40vw",
            }}
          >
            <CrittersPanel setActivePanel={setActivePanel} />
          </Box>
        </Collapse>
        <Collapse
          in={activePanel === "shop"}
          orientation="horizontal"
          mountOnEnter
          unmountOnExit
          sx={{
            height: "100%",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: "40vw",
            }}
          >
            <ShopPanel setActivePanel={setActivePanel} />
          </Box>
        </Collapse>
      </Stack>
    </Box>
  );
}