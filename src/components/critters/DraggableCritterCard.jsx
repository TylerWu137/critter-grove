import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { useCritters } from "./CrittersContext";
import CritterCard from "./CritterCard";

export default function DraggableCritterCard({ id }) {
  const { getCritterById, setSelectedCritter } = useCritters();
  const critter = getCritterById(id);

  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } =
    useDraggable({ id });
  const { setNodeRef: setDropRef } = useDroppable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1,
    cursor: "grab",
  };

  const setNodeRef = (node) => {
    setDragRef(node);
    setDropRef(node);
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