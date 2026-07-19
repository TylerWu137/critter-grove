import { Button, Typography } from "@mui/material";

import PanelShell from "./common/PanelShell";
import InProgressPlaceholder from "./common/InProgressPlaceholder";

export default function ShopPanel({ setActivePanel }) {
  return (
    <PanelShell
      title="Shop"
      footerLeft={
        <Button variant="menu" onClick={() => setActivePanel(null)}>
          <Typography variant="h3">Close</Typography>
        </Button>
      }
      // no footerRight — Shop has no redirect target like Companions/CritterDex (yet)
    >
      <InProgressPlaceholder label="Shop" />
    </PanelShell>
  );
}