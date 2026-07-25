import { createContext, useContext, useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { useAuth } from "../../context/AuthContext";

const MAX_COMPANIONS = 6;

const CrittersContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function CrittersProvider({ children }) {
  const { currentUserId, token, isLoading: authIsLoading } = useAuth();

  const [ownedCritters, setOwnedCritters] = useState([]);
  const [critterSpecies, setCritterSpecies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const companions = ownedCritters.filter((c) => c.isCompanion);
  const critters = ownedCritters.filter((c) => !c.isCompanion);

  const [viewingFullInfo, setViewingFullInfo] = useState(false);
  const [activeCritter, setActiveCritter] = useState(null);
  const [selectedCritter, setSelectedCritter] = useState(null);
  const [pickingCompanion, setPickingCompanion] = useState(false);
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // ★ CHANGED — fetches owned critters + the species catalog from the
  // backend, same authIsLoading-gated pattern as QuestsContext/ProfileContext
  useEffect(() => {
    if (authIsLoading) return;

    const fetchAll = async () => {
      if (!currentUserId || !token) {
        setOwnedCritters([]);
        setCritterSpecies([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const [ownedRes, speciesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/critters`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/critters/species`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (!ownedRes.ok || !speciesRes.ok) throw new Error("Failed to fetch critters/species");

        setOwnedCritters(await ownedRes.json());
        setCritterSpecies(await speciesRes.json());
      } catch {
        setOwnedCritters([]);
        setCritterSpecies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [currentUserId, token, authIsLoading]);

  const getCritterById = (id) => ownedCritters.find((c) => id === c.id) ?? null;
  const getSpeciesById = (speciesId) => critterSpecies.find((s) => s.id === speciesId) ?? null;
  const getCritterName = (critter) => getSpeciesById(critter?.speciesId)?.name ?? "???";

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveCritter(getCritterById(active.id));
  };

  // ★ CHANGED throughout handleDragEnd — local state updates are still
  // IMMEDIATE (optimistic), since drag-and-drop needs instant visual
  // feedback with no network delay. Each branch also fires a background
  // request to persist the change. No rollback-on-failure here (unlike
  // toggleQuestCompletion) — added complexity wasn't worth it for this
  // pass; a failed background call just means local/server state could
  // drift until the next full refetch. Worth revisiting if that turns out
  // to matter in practice.
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveCritter(null);
    if (!over) return;

    if (typeof over.id === "string" && over.id.startsWith("empty-slot-")) {
      const activeCritterData = getCritterById(active.id);
      if (activeCritterData && !activeCritterData.isCompanion && companions.length < MAX_COMPANIONS) {
        setOwnedCritters((items) =>
          items.map((c) => (c.id === active.id ? { ...c, isCompanion: true } : c))
        );
        fetch(`${API_BASE_URL}/api/critters/${active.id}/awaken`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      return;
    }

    const activeCritterData = getCritterById(active.id);
    const overCritterData = getCritterById(over.id);
    if (!activeCritterData || !overCritterData) return;

    if (!activeCritterData.isCompanion && !overCritterData.isCompanion) {
      return; // both critters — no reordering among non-companions
    }

    if (activeCritterData.isCompanion === overCritterData.isCompanion) {
      // both companions — reorder within companions. Purely local/display —
      // the backend has no concept of companion ORDER, only isCompanion,
      // so nothing needs to be persisted here.
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
      // cross swap — one is a companion, the other isn't
      setOwnedCritters((items) =>
        items.map((c) => {
          if (c.id === active.id) return { ...c, isCompanion: overCritterData.isCompanion };
          if (c.id === over.id) return { ...c, isCompanion: activeCritterData.isCompanion };
          return c;
        })
      );

      const [critterId, companionId] = activeCritterData.isCompanion
        ? [over.id, active.id]
        : [active.id, over.id];

      fetch(`${API_BASE_URL}/api/critters/${critterId}/swap`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ companionId }),
      });
    }
  };

  // ★ CHANGED — feedCritter and everything below: async, await the
  // backend, trust its response as the new state (same pattern as
  // ProfileContext — these are discrete button actions, not a
  // continuous drag gesture, so waiting for the network is fine here)

  const feedCritter = async (critter, foodAmt) => {
    const res = await fetch(`${API_BASE_URL}/api/critters/${critter.id}/feed`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ amount: foodAmt }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setOwnedCritters((items) => items.map((item) => (item.id === updated.id ? updated : item)));
    setSelectedCritter(updated);
  };

  const startAwakenCompanion = () => setPickingCompanion(true);
  const cancelAwakenCompanion = () => setPickingCompanion(false);

  const addToCompanions = async () => {
    if (!selectedCritter || selectedCritter.isCompanion) return;
    if (companions.length >= MAX_COMPANIONS) return;

    const res = await fetch(`${API_BASE_URL}/api/critters/${selectedCritter.id}/awaken`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const updated = await res.json();
    setOwnedCritters((items) => items.map((item) => (item.id === updated.id ? updated : item)));
    setSelectedCritter(updated);
    setPickingCompanion(false);
  };

  const hibernateCompanion = async () => {
    if (!selectedCritter || !selectedCritter.isCompanion) return;

    const res = await fetch(`${API_BASE_URL}/api/critters/${selectedCritter.id}/hibernate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const updated = await res.json();
    setOwnedCritters((items) => items.map((item) => (item.id === updated.id ? updated : item)));
    setSelectedCritter(updated);
  };

  const swapWithCompanion = async (companionId) => {
    if (!selectedCritter) return;
    const companion = getCritterById(companionId);
    if (!companion || selectedCritter.isCompanion === companion.isCompanion) {
      setPickingCompanion(false);
      return;
    }

    const res = await fetch(`${API_BASE_URL}/api/critters/${selectedCritter.id}/swap`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ companionId }),
    });
    if (!res.ok) {
      setPickingCompanion(false);
      return;
    }

    // the swap endpoint only returns the primary critter — refetch owned
    // critters wholesale to pick up the companion's flipped state too,
    // rather than trying to hand-patch two records from one response
    const ownedRes = await fetch(`${API_BASE_URL}/api/critters`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (ownedRes.ok) {
      const refreshed = await ownedRes.json();
      setOwnedCritters(refreshed);
      setSelectedCritter(refreshed.find((c) => c.id === selectedCritter.id) ?? null);
    }
    setPickingCompanion(false);
  };

  const exitCritterInfo = () => {
    setSelectedCritter(null);
    setViewingFullInfo(false);
  };

  const viewCritterFullInfo = (critter) => {
    setSelectedCritter(critter);
    setViewingFullInfo(true);
  };

  const openReleaseModal = () => setReleaseModalOpen(true);
  const closeReleaseModal = () => setReleaseModalOpen(false);

  const releaseCritter = async () => {
    if (!selectedCritter) return;

    const res = await fetch(`${API_BASE_URL}/api/critters/${selectedCritter.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;

    setOwnedCritters((items) => items.filter((item) => item.id !== selectedCritter.id));
    setReleaseModalOpen(false);
    setSelectedCritter(null);
  };

  // ★ ADDED — not wired to any button yet (your UI never had a "catch a
  // critter" flow, since critters were previously just pre-seeded dummy
  // data). Exposed here so it's at least callable/testable; you'll need
  // an actual "rescue/catch" UI at some point to give new users critters.
  const catchCritter = async (speciesId) => {
    const res = await fetch(`${API_BASE_URL}/api/critters`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ speciesId }),
    });
    if (!res.ok) return null;
    const newCritter = await res.json();
    setOwnedCritters((prev) => [...prev, newCritter]);
    return newCritter;
  };

  const value = {
    companions,
    critters,
    ownedCritters,
    critterSpecies, // ★ ADDED — wasn't exposed before; needed to actually list species anywhere (e.g. a future catch UI)
    isLoading,
    activeCritter,
    selectedCritter,
    setSelectedCritter,
    viewingFullInfo,
    exitCritterInfo,
    viewCritterFullInfo,
    getCritterById,
    getSpeciesById,
    getCritterName,
    catchCritter, // ★ ADDED
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