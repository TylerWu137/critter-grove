import AddIcon from '@mui/icons-material/Add';
import { IconButton } from "@mui/material";

export default function AddButton({sx}) {
    return (
        <IconButton sx={{width: "40px", height: "40px", border: "1.5px solid var(--light-brown)", color: "var(--light-brown)",
                transition: "color 200ms ease",
                "&:hover": {
                    color: "var(--brown)",
                    borderColor: "var(--brown)"
                },
                ...sx
            }}>
            <AddIcon />
        </IconButton>
        
    );
}