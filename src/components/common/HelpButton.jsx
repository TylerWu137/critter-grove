import HelpIcon from '@mui/icons-material/Help';
import { IconButton } from "@mui/material";

export default function HelpButton() {
    return (
        <HelpIcon sx={{width: "40px", height: "40px", color: "var(--light-brown)",
            transition: "color 200ms ease",
            "&:hover": {
                color: "var(--brown)"
            }
        }}/>
    );
}