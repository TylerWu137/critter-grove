import { createContext, useContext, useState, useEffect } from "react";

import { quests as initialQuests } from "../data/quests";
import { questTags as initialQuestTags } from "../data/questTags";
import { useAuth } from "./AuthContext"; // ★ ADDED

const QuestsContext = createContext(null);
// ★ REMOVED — const CURRENT_USER_ID = 1;

export function QuestsProvider({ children }) {
  const { currentUserId } = useAuth(); // ★ ADDED

  const [quests, setQuests] = useState([]); // ★ CHANGED — starts empty, populated by the effect below

  // ★ ADDED — reloads this user's quests whenever the logged-in user changes
  useEffect(() => {
    setQuests(initialQuests.filter((q) => q.userId === currentUserId));
  }, [currentUserId]);

  const [questTags, setQuestTags] = useState(initialQuestTags);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [editingQuestId, setEditingQuestId] = useState(null);
  const [questToDelete, setQuestToDelete] = useState(null);
  const deleteModalOpen = questToDelete !== null;

  const getTagById = (tagId) => questTags.find((t) => t.id === tagId) ?? null;

  const toggleTagFilter = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const addTag = (name) => {
    setQuestTags((prev) => [
      ...prev,
      { id: Math.max(0, ...prev.map((t) => t.id)) + 1, name, color: "var(--brown)" },
    ]);
  };

  const getQuestsByType = (type) => {
    const filtered = quests
      .filter((q) => q.type === type)
      .filter(
        (q) =>
          selectedTagIds.length === 0 ||
          (q.tagId !== null && selectedTagIds.includes(q.tagId))
      );
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
        userId: currentUserId, // ★ CHANGED — was CURRENT_USER_ID
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

  const startEditingQuest = (questId) => setEditingQuestId(questId);
  const stopEditingQuest = () => setEditingQuestId(null);

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

    selectedTagIds,
    toggleTagFilter,
    addTag,

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