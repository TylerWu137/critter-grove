import { Stack, TextField } from "@mui/material";
import { useState } from "react";

import ScreenShell from "../components/common/ScreenShell" // ★ CHANGED
import AddQuestPopover from "../components/quests/AddQuestPopover"
import TagsSection from "../components/quests/TagsSection"
import QuestsSection from "../components/quests/QuestsSection"
import DeleteQuestModal from "../components/quests/DeleteQuestModal";

export default function QuestsScreen() {
  const [search, setSearch] = useState("");

  return (
    <>
      <ScreenShell
        title="Quests"
        headerCenter={
          <>
            <AddQuestPopover />
            <TextField
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: "33%" }}
            />
          </>
        }
      >
        <Stack direction="row" spacing={3} sx={{ flex: 1, minHeight: 0, alignItems: "stretch", width: "90%" }}>
          <TagsSection />
          <QuestsSection section={"daily"} search={search} />
          <QuestsSection section={"epic"} search={search} />
          <QuestsSection section={"side"} search={search} />
        </Stack>
      </ScreenShell>

      {/* ★ CHANGED — DeleteQuestModal stays outside the shell, same pattern as
          CrittersPanel keeping PickCompanionBackdrop/ReleaseConfirmModal
          outside PanelShell: it's Quests-specific, the shell shouldn't know about it */}
      <DeleteQuestModal />
    </>
  );
}