import HelpIcon from '@mui/icons-material/Help';
import { Box } from "@mui/material";

export default function HelpButton({ sx }) {
    return (
        <Box sx={{ display: "flex", justifyContent: "flex-end", ...sx }}>
            <HelpIcon
                sx={{
                    width: "40px",
                    height: "40px",
                    color: "var(--light-brown)",
                    transition: "color 200ms ease",
                    "&:hover": {
                        color: "var(--brown)"
                    },
                }}
            />
        </Box>
    );
}