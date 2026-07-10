import { useState } from "react";
import { Stack, Box } from "@mui/material";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import MyCompanionsSection from "./MyCompanionsSection";
import MyCrittersSection from "./MyCrittersSection";
import CritterCard from "./CritterCard";
import { DragOverlay } from "@dnd-kit/core";
import { userCompanions as initialCompanions } from "../../data/companions";
import { userCritters as initialCritters } from "../../data/critters";

export default function CrittersCompanionsView() {
  const [companions, setCompanions] = useState(initialCompanions);
  const [critters, setCritters] = useState(() =>
    initialCritters.filter(
      (critter) => !initialCompanions.some((c) => c.id === critter.id)
    )
  );
  const [activeCritter, setActiveCritter] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 5 }, // avoid accidental drags on click
  }));

  // find which list + index a given id currently lives in
  const findContainer = (id) => {
    if (companions.some((c) => c.id === id)) return "companions";
    if (critters.some((c) => c.id === id)) return "critters";
    return null;
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const container = findContainer(active.id);
    const list = container === "companions" ? companions : critters;
    setActiveCritter(list.find((c) => c.id === active.id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveCritter(null);
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer) return;

    if (activeContainer === overContainer) {
      // reorder within the same list (unchanged)
      const setList = activeContainer === "companions" ? setCompanions : setCritters;
      setList((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return items;
        return arrayMove(items, oldIndex, newIndex);
      });
    } else {
      // swap between lists — active item and over item trade places
      const sourceList = activeContainer === "companions" ? companions : critters;
      const destList = activeContainer === "companions" ? critters : companions;
      const setSource = activeContainer === "companions" ? setCompanions : setCritters;
      const setDest = activeContainer === "companions" ? setCritters : setCompanions;

      const activeIndex = sourceList.findIndex((i) => i.id === active.id);
      const overIndex = destList.findIndex((i) => i.id === over.id);
      if (activeIndex === -1 || overIndex === -1) return;

      const movedOut = sourceList[activeIndex];
      const movedIn = destList[overIndex];

      const newSource = [...sourceList];
      newSource[activeIndex] = movedIn;

      const newDest = [...destList];
      newDest[overIndex] = movedOut;

      setSource(newSource);
      setDest(newDest);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Stack spacing={1.5} sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <MyCompanionsSection companions={companions} />
        <Box sx={{ height: 2, backgroundColor: "var(--brown)", borderRadius: "999px" }} />
        <MyCrittersSection critters={critters} companions={companions} />
      </Stack>

      <DragOverlay>
        {activeCritter ? (
          <CritterCard name={activeCritter.name} level={activeCritter.level} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}