import {Stack, Box, Typography, Button, Link} from "@mui/material";
import logoImage from "../assets/images/logo.png";
import FullscreenButton from "./FullscreenButton";

export default function SplashscreenSkeleton({
  leftContent,
  rightContent,
}) {
  return (
    <Stack sx={{ height: "100vh",  backgroundColor: "var(--cream)"}}>
        {/* empty top header */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "right"}}><FullscreenButton/></Box>

        {/* welcome info */}
        <Stack
            direction="row"
            spacing={30}
            sx={{
            flex: 3,
            py: 10,
            px: 20,
            backgroundColor: "var(--green)"
            }}
        >
            {leftContent}
            {rightContent}
        </Stack>

        {/* critter animation */}
        <Box
            sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "var(--cream)"
            }}
        >
            Critter Animation
        </Box>
    </Stack>
  );
}