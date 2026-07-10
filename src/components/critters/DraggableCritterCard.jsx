// DraggableCritterCard.jsx — for the Critters section only (no reordering)
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import CritterCard from "./CritterCard";

export default function DraggableCritterCard({ id, name, level }) {
  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } =
    useDraggable({ id });
  const { setNodeRef: setDropRef } = useDroppable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1,
    cursor: "grab",
  };

  // combine both refs onto the same node
  const setNodeRef = (node) => {
    setDragRef(node);
    setDropRef(node);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CritterCard name={name} level={level} />
    </div>
  );
}