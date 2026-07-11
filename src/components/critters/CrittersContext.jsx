import { createContext, useContext, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { userCompanions as initialCompanions } from "../../data/companions";
import { userCritters as initialCritters } from "../../data/critters";

const CrittersContext = createContext(null);

export function CrittersProvider({ children }) {
  const [companions, setCompanions] = useState(initialCompanions);
  const [critters, setCritters] = useState(() =>
    initialCritters.filter(
      (critter) => !initialCompanions.some((c) => c.id === critter.id)
    )
  );
  const [activeCritter, setActiveCritter] = useState(null);
  const [selectedCritter, setSelectedCritter] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // avoid accidental drags on click
    })
  );

  // find which list a given id currently lives in
  const findContainer = (id) => {
    if (companions.some((c) => c.id === id)) return "companions";
    if (critters.some((c) => c.id === id)) return "critters";
    return null;
  };

  // look up a critter's data by id, regardless of which list it's in
  const getCritterById = (id) =>
    companions.find((c) => c.id === id) ?? critters.find((c) => c.id === id) ?? null;

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveCritter(getCritterById(active.id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveCritter(null);
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer) return;

    // block any interaction where both cards are in the critters section
    if (activeContainer === "critters" && overContainer === "critters") {
      return;
    }

    if (activeContainer === overContainer) {
      // only reachable for companions — reorder within companions
      setCompanions((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return items;
        return arrayMove(items, oldIndex, newIndex);
      });
    } else {
      // cross-list swap (companions <-> critters)
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

  // add foodAmt xp to a critter, cascading level-ups whenever xp exceeds level*10
  const feedCritter = (critter, foodAmt) => {
    const container = findContainer(critter.id);
    if (!container) return;

    let newXp = critter.xp + foodAmt;
    let newLevel = critter.level;
    while (newXp > newLevel * 10) {
      newXp -= newLevel * 10;
      newLevel++;
    }

    const updatedCritter = { ...critter, xp: newXp, level: newLevel };

    const setList = container === "companions" ? setCompanions : setCritters;
    setList((items) =>
      items.map((item) => (item.id === critter.id ? updatedCritter : item))
    );

    // keep the info panel in sync with the freshly updated critter
    setSelectedCritter(updatedCritter);
  };

  const value = {
    companions,
    critters,
    activeCritter,
    selectedCritter,
    setSelectedCritter,
    getCritterById,
    feedCritter,
    sensors,
    closestCenter,
    handleDragStart,
    handleDragEnd,
  };

  return (
    <CrittersContext.Provider value={value}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {children}
      </DndContext>
    </CrittersContext.Provider>
  );
}

export function useCritters() {
  const ctx = useContext(CrittersContext);
  if (!ctx) throw new Error("useCritters must be used within a CrittersProvider");
  return ctx;
}