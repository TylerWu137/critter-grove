import { createContext, useContext, useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { ownedCritters as initialOwnedCritters } from "../../data/ownedCritters";
import { critterSpecies } from "../../data/critterSpecies";
import { useAuth } from "../../context/AuthContext"; // ★ ADDED

const MAX_COMPANIONS = 6;
// ★ REMOVED — const CURRENT_USER_ID = 1;

const CrittersContext = createContext(null);

export function CrittersProvider({ children }) {
  const { currentUserId } = useAuth(); // ★ ADDED

  const [ownedCritters, setOwnedCritters] = useState([]); // ★ CHANGED — starts empty, populated by the effect below

  // ★ ADDED — (re)loads this user's critters whenever the logged-in user
  // changes (login, logout, or switching accounts)
  useEffect(() => {
    setOwnedCritters(initialOwnedCritters.filter((c) => c.userId === currentUserId));
  }, [currentUserId]);

  const companions = ownedCritters.filter((c) => c.isCompanion);
  const critters = ownedCritters.filter((c) => !c.isCompanion);

  const [viewingFullInfo, setViewingFullInfo] = useState(false);
  const [activeCritter, setActiveCritter] = useState(null);
  const [selectedCritter, setSelectedCritter] = useState(null);
  const [pickingCompanion, setPickingCompanion] = useState(false);
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // avoid accidental drags on click
    })
  );

  const getCritterById = (id) => ownedCritters.find((c) => id === c.id) ?? null;
  const getSpeciesById = (speciesId) => critterSpecies.find((s) => s.id === speciesId) ?? null;

  const getCritterName = (critter) => getSpeciesById(critter?.speciesId)?.name ?? "???";

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveCritter(getCritterById(active.id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveCritter(null);
    if (!over) return;

    // dropping a critter directly onto an empty companion slot
    // (over.id looks like "empty-slot-0") adds it with no swap partner needed
    if (typeof over.id === "string" && over.id.startsWith("empty-slot-")) {
      const activeCritterData = getCritterById(active.id);
      if (activeCritterData && !activeCritterData.isCompanion && companions.length < MAX_COMPANIONS) {
        setOwnedCritters((items) =>
          items.map((c) => (c.id === active.id ? { ...c, isCompanion: true } : c))
        );
      }
      return;
    }

    const activeCritterData = getCritterById(active.id);
    const overCritterData = getCritterById(over.id);
    if (!activeCritterData || !overCritterData) return;

    // block any interaction where both cards are critters (not companions)
    if (!activeCritterData.isCompanion && !overCritterData.isCompanion) {
      return;
    }

    if (activeCritterData.isCompanion === overCritterData.isCompanion) {
      // both companions — reorder within companions
      setOwnedCritters((items) => {
        const companionItems = items.filter((c) => c.isCompanion);
        const otherItems = items.filter((c) => !c.isCompanion);

        const oldIndex = companionItems.findIndex((c) => c.id === active.id);
        const newIndex = companionItems.findIndex((c) => c.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return items;

        const reordered = arrayMove(companionItems, oldIndex, newIndex);
        return [...reordered, ...otherItems];
      });
    } else {
      // cross swap — one is a companion, the other isn't: flip both flags
      setOwnedCritters((items) =>
        items.map((c) => {
          if (c.id === active.id) return { ...c, isCompanion: overCritterData.isCompanion };
          if (c.id === over.id) return { ...c, isCompanion: activeCritterData.isCompanion };
          return c;
        })
      );
    }
  }

  // add foodAmt xp to a critter, cascading level-ups whenever xp exceeds level*10
  const feedCritter = (critter, foodAmt) => {
    let newXp = critter.xp + foodAmt;
    let newLevel = critter.level;
    while (newXp > newLevel * 10) {
      newXp -= newLevel * 10;
      newLevel++;
    }

    const updatedCritter = { ...critter, xp: newXp, level: newLevel };
    setOwnedCritters((items) =>
      items.map((item) => (item.id === critter.id ? updatedCritter : item))
    );

    // keep the info panel in sync with the freshly updated critter
    setSelectedCritter(updatedCritter);
  };

  // opens the "pick a companion to swap" backdrop + highlight flow
  const startAwakenCompanion = () => setPickingCompanion(true);
  const cancelAwakenCompanion = () => setPickingCompanion(false);

  // adds selectedCritter directly into companions (no swap partner needed)
  // used when clicking an EMPTY companion slot during pick mode
  const addToCompanions = () => {
    if (!selectedCritter || selectedCritter.isCompanion) return;
    if (companions.length >= MAX_COMPANIONS) return;

    const updatedCritter = {...selectedCritter, isCompanion: true }

    setOwnedCritters((items) => items.map((item) => (item.id === selectedCritter.id ? updatedCritter : item)))
    setSelectedCritter({ ...selectedCritter, isCompanion: true });
    setPickingCompanion(false);
  };

  // moves a companion back to the critters list, no swap needed
  const hibernateCompanion = () => {
    if (!selectedCritter || !selectedCritter.isCompanion) return;
    const updatedCritter = {...selectedCritter, isCompanion: false }
    setOwnedCritters((items) => items.map((item) => (item.id === selectedCritter.id ? updatedCritter : item)))
    setSelectedCritter({ ...selectedCritter, isCompanion: false });
  };

  // swaps selectedCritter into companions, in place of the chosen companion
  const swapWithCompanion = (companionId) => {
    if (!selectedCritter) return;
    const companion = getCritterById(companionId);
    if (!companion || selectedCritter.isCompanion === companion.isCompanion) {
      setPickingCompanion(false);
      return;
    }

    setOwnedCritters((items) =>
      items.map((c) => {
        if (c.id === selectedCritter.id) return { ...c, isCompanion: true };
        if (c.id === companionId) return { ...c, isCompanion: false };
        return c;
      })
    );

    setSelectedCritter({ ...selectedCritter, isCompanion: true });
    setPickingCompanion(false);
  };

  // clears the selection AND the full-view flag together, so components
  // don't need to remember to reset both separately
  const exitCritterInfo = () => {
    setSelectedCritter(null);
    setViewingFullInfo(false);
  };

  // used by CritterDex cards: selects a critter AND flags that
  // CritterInfoSection should replace the whole panel body, not just a section
  const viewCritterFullInfo = (critter) => {
    setSelectedCritter(critter);
    setViewingFullInfo(true);
  };

  const openReleaseModal = () => setReleaseModalOpen(true);
  const closeReleaseModal = () => setReleaseModalOpen(false);

  // permanently removes the selected critter from whichever list it's in
  const releaseCritter = () => {
    if (!selectedCritter) return;

    setOwnedCritters((items) => items.filter((item) => item.id !== selectedCritter.id));
    setReleaseModalOpen(false);
    setSelectedCritter(null);
  };

  const value = {
    companions,
    critters,
    ownedCritters,
    activeCritter,
    selectedCritter,
    setSelectedCritter,
    viewingFullInfo,
    exitCritterInfo,
    viewCritterFullInfo,
    getCritterById,
    getSpeciesById,
    getCritterName,
    feedCritter,
    pickingCompanion,
    startAwakenCompanion,
    cancelAwakenCompanion,
    swapWithCompanion,
    addToCompanions,
    hibernateCompanion,
    maxCompanions: MAX_COMPANIONS,
    releaseModalOpen,
    openReleaseModal,
    closeReleaseModal,
    releaseCritter,
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