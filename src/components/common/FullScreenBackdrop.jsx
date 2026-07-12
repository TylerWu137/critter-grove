import { createPortal } from "react-dom";
import { Backdrop } from "@mui/material";

// Renders via a portal straight to document.body, so it always covers the
// full viewport -- regardless of where it's used in the component tree, and
// regardless of any ancestor using transform/zoom (which would otherwise
// break plain position:fixed elements).
export default function FullScreenBackdrop({ open, onClick, zIndex = 1300, sx, children }) {
  return createPortal(
    <Backdrop
      open={open}
      onClick={onClick}
      sx={{ zIndex, backgroundColor: "rgba(0,0,0,0.6)", ...sx }}
    >
      {children}
    </Backdrop>,
    document.body
  );
}