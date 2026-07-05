import {Stack, Box} from "@mui/material";


import UserProfile from "../components/UserProfile";
import Currencies from "../components/Currencies";
import TodayUpdates from "../components/TodayUpdates";
import NavBar from "../components/NavBar";


export default function CalendarScreen() {
  return (
    <Box sx={{pt: 4, pb: 2, pl: 4, pr: 4, height: "100%", boxSizing: "border-box", backgroundColor: "var(--green)"}}>
      <Stack sx={{height: "1"}}>
        <Stack direction="row" sx={{flex: 2}}>
          <UserProfile username={"Little Dragon"} currentXp={80} xpForNextLevel={100} level={18}/>
          <Box sx={{flex: 1}}/>
          <Currencies acornAmt={"125"} treatAmt={"27,232,293"} flowerAmt={"8"} />
        </Stack>
        <TodayUpdates sx={{flex: 6}}/>
        <NavBar sx={{flex: 1}}/>
      </Stack>
    </Box>
  );
}