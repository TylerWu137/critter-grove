import {Stack, Box, Collapse, Fade} from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import PlayerTopBar from "../components/PlayerTopBar/PlayerTopBar";
import TodayUpdates from "../components/TodayUpdates";
import NavBar from "../components/common/NavBar";
import CrittersPanel from "../components/critters/CrittersPanel";
import ShopPanel from "../components/ShopPanel";


export default function HomeScreen() {
  const [activePanel, setActivePanel] = useState(null);
  const location = useLocation(); // ★ ADDED

  // ★ ADDED — picks up { state: { openPanel: "critters" } } passed by
  // NavBar's navigate() call from other screens, and opens that panel here
  useEffect(() => {
    if (location.state?.openPanel) {
      setActivePanel(location.state.openPanel);
    }
  }, [location.state]);

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
            width: "100%",
            flex: 1,
            boxSizing: "border-box",
          }}
        >
          <Stack sx={{ height: "100%" , width: "100%"}}>
            <PlayerTopBar sx={{flex: 2}} activePanel = {activePanel} />
            <Box sx={{flex: 1}} />

            <Fade
              in={activePanel === null}
              timeout={200}
              easing={{
                enter: "ease-in-out",
                exit: "ease-in-out",
              }}
              unmountOnExit
              sx={{
                flex: 10,
                width: "30%",
                alignSelf: "flex-end",
              }}
            >
              <Box>
                <TodayUpdates sx={{height: "100%"}}/>
              </Box>
            </Fade>

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