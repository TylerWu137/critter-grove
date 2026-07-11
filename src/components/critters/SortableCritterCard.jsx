import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useCritters } from "./CrittersContext";
import CritterCard from "./CritterCard";

export default function SortableCritterCard({ id }) {
  const { getCritterById, setSelectedCritter } = useCritters();
  const critter = getCritterById(id);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    opacity: isDragging ? 0 : 1,
    cursor: "grab",
  };

  if (!critter) return null;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CritterCard
        name={critter.name}
        level={critter.level}
        onClick={() => setSelectedCritter(critter)}
      />
    </div>
  );
}