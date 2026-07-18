import { createContext, useContext, useState } from "react";

import { quests as initialQuests } from "../data/quests";
import { questTags } from "../data/questTags";

const QuestsContext = createContext(null);

// placeholder until real auth exists -- swap for AuthContext's currentUserId later
const CURRENT_USER_ID = 1;

export function QuestsProvider({ children }) {
  const [quests, setQuests] = useState(() =>
    initialQuests.filter((q) => q.userId === CURRENT_USER_ID)
  );

  // ★ ADDED — which quest (if any) is currently in edit mode. Centralizing
  // this (rather than each QuestCard tracking its own isEditing bool) means
  // only one card can be in edit mode at a time, app-wide.
  const [editingQuestId, setEditingQuestId] = useState(null);

  // ★ ADDED — mirrors CrittersContext's releaseModalOpen/selectedCritter
  // pattern: a single quest reference + open flag, so ONE delete modal can
  // be rendered once for the whole app instead of once per QuestCard.
  const [questToDelete, setQuestToDelete] = useState(null);
  const deleteModalOpen = questToDelete !== null;

  // static lookup — tags are shared reference data, not per-user state
  const getTagById = (tagId) => questTags.find((t) => t.id === tagId) ?? null;

  const getQuestsByType = (type) => {
    const filtered = quests.filter((q) => q.type === type);
    const incomplete = filtered.filter((q) => !q.isCompleted);
    const completed = filtered.filter((q) => q.isCompleted);
    return [...incomplete, ...completed];
  };

  const toggleQuestCompletion = (questId) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;
    const newCompleted = !quest.isCompleted;

    if (newCompleted) {
      setQuests((prev) =>
        prev.map((q) => (q.id === questId ? { ...q, isCompleted: true } : q))
      );

      setTimeout(() => {
        setQuests((prev) => {
          const target = prev.find((q) => q.id === questId);
          if (!target || !target.isCompleted) return prev;
          const without = prev.filter((q) => q.id !== questId);
          return [...without, target];
        });
      }, 1500);
    } else {
      setQuests((prev) => {
        const without = prev.filter((q) => q.id !== questId);
        return [...without, { ...quest, isCompleted: false }];
      });
    }
  };

  const addQuest = (questData) => {
    setQuests((items) => [
      ...items,
      {
        id: Math.max(0, ...items.map((q) => q.id)) + 1,
        userId: CURRENT_USER_ID,
        tagId: null,
        date: null,
        time: null,
        isCompleted: false,
        ...questData,
      },
    ]);
  };

  const editQuest = (questId, updates) => {
    setQuests((items) =>
      items.map((q) => (q.id === questId ? { ...q, ...updates } : q))
    );
  };

  const deleteQuest = (questId) => {
    setQuests((items) => items.filter((q) => q.id !== questId));
  };

  // ★ ADDED — edit-mode controls
  const startEditingQuest = (questId) => setEditingQuestId(questId);
  const stopEditingQuest = () => setEditingQuestId(null);

  // ★ ADDED — delete-modal controls (same shape as closeReleaseModal/releaseCritter)
  const openDeleteModal = (quest) => setQuestToDelete(quest);
  const closeDeleteModal = () => setQuestToDelete(null);
  const confirmDeleteQuest = () => {
    if (!questToDelete) return;
    deleteQuest(questToDelete.id);
    setQuestToDelete(null);
  };

  const value = {
    quests,
    questTags,
    getTagById,
    getQuestsByType,
    toggleQuestCompletion,
    addQuest,
    editQuest,
    deleteQuest,

    // ★ ADDED
    editingQuestId,
    startEditingQuest,
    stopEditingQuest,

    deleteModalOpen,
    questToDelete,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteQuest,
  };

  return <QuestsContext.Provider value={value}>{children}</QuestsContext.Provider>;
}

export function useQuests() {
  const ctx = useContext(QuestsContext);
  if (!ctx) throw new Error("useQuests must be used within a QuestsProvider");
  return ctx;
}