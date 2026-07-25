import { createContext, useContext, useState, useEffect } from "react";

import { useAuth } from "./AuthContext";

const QuestsContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function QuestsProvider({ children }) {
  const { currentUserId, token, isLoading: authIsLoading } = useAuth();

  const [quests, setQuests] = useState([]);
  const [questTags, setQuestTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // pure UI/local state — never sent to the backend
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [editingQuestId, setEditingQuestId] = useState(null);
  const [questToDelete, setQuestToDelete] = useState(null);
  const deleteModalOpen = questToDelete !== null;

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // ★ CHANGED — fetches quests + tags from the backend instead of reading
  // local dummy arrays. Waits for authIsLoading first, same reasoning as
  // ProfileContext: currentUserId is briefly null while AuthContext is
  // still checking a stored token, and treating that as "logged out" would
  // wrongly clear everything on every page reload.
  useEffect(() => {
    if (authIsLoading) return;

    const fetchAll = async () => {
      if (!currentUserId || !token) {
        setQuests([]);
        setQuestTags([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const [questsRes, tagsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/quests`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/api/quest-tags`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (!questsRes.ok || !tagsRes.ok) throw new Error("Failed to fetch quests/tags");

        setQuests(await questsRes.json());
        setQuestTags(await tagsRes.json());
      } catch {
        setQuests([]);
        setQuestTags([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [currentUserId, token, authIsLoading]);

  const getTagById = (tagId) => questTags.find((t) => t.id === tagId) ?? null;

  const toggleTagFilter = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  // ★ CHANGED — now async, POSTs to the backend, then appends the
  // server-returned tag (with its real id) to local state
  const addTag = async (name, color) => {
    const res = await fetch(`${API_BASE_URL}/api/quest-tags`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ name, color }),
    });
    if (!res.ok) return;
    const newTag = await res.json();
    setQuestTags((prev) => [...prev, newTag]);
  };

  // unchanged — still purely client-side filtering/sorting over whatever
  // `quests` currently holds, regardless of where that data came from
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

  // ★ CHANGED — the local reorder-to-bottom-after-a-delay behavior is
  // UNCHANGED (still purely local array manipulation, since the backend
  // doesn't track display order at all). What's new: the isCompleted flag
  // itself is now persisted via a background PATCH call, optimistically
  // (the UI updates instantly; if the backend call fails, we revert).
  const toggleQuestCompletion = (questId) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;
    const newCompleted = !quest.isCompleted;

    const persistToggle = () => {
      fetch(`${API_BASE_URL}/api/quests/${questId}/toggle-completion`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {
        // revert the optimistic update if the backend call failed
        setQuests((prev) =>
          prev.map((q) => (q.id === questId ? { ...q, isCompleted: quest.isCompleted } : q))
        );
      });
    };

    if (newCompleted) {
      setQuests((prev) =>
        prev.map((q) => (q.id === questId ? { ...q, isCompleted: true } : q))
      );
      persistToggle();

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
      persistToggle();
    }
  };

  const addQuest = async (questData) => {
    const res = await fetch(`${API_BASE_URL}/api/quests`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(questData),
    });
    if (!res.ok) return;
    const newQuest = await res.json();
    setQuests((prev) => [...prev, newQuest]);
  };

  const editQuest = async (questId, updates) => {
    const res = await fetch(`${API_BASE_URL}/api/quests/${questId}`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify(updates),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setQuests((prev) => prev.map((q) => (q.id === questId ? updated : q)));
  };

  const deleteQuest = async (questId) => {
    const res = await fetch(`${API_BASE_URL}/api/quests/${questId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    setQuests((prev) => prev.filter((q) => q.id !== questId));
  };

  const startEditingQuest = (questId) => setEditingQuestId(questId);
  const stopEditingQuest = () => setEditingQuestId(null);

  const openDeleteModal = (quest) => setQuestToDelete(quest);
  const closeDeleteModal = () => setQuestToDelete(null);
  const confirmDeleteQuest = async () => {
    if (!questToDelete) return;
    await deleteQuest(questToDelete.id);
    setQuestToDelete(null);
  };

  const value = {
    quests,
    questTags,
    isLoading,
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