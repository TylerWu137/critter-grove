import ScreenShell from "../components/common/ScreenShell";
import InProgressPlaceholder from "../components/common/InProgressPlaceholder";

export default function JournalScreen() {
  return (
    <ScreenShell title="Journal">
      <InProgressPlaceholder label="Journal" />
    </ScreenShell>
  );
}