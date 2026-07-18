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

  // static lookup — tags are shared reference data, not per-user state
  const getTagById = (tagId) => questTags.find((t) => t.id === tagId) ?? null;

  // ★ CHANGED — was a plain type filter; now also splits into
  // incomplete-first, completed-second, each preserving their relative
  // order from the underlying array (which toggleQuestCompletion keeps
  // correctly positioned — see below)
  const getQuestsByType = (type) => {
    const filtered = quests.filter((q) => q.type === type);
    const incomplete = filtered.filter((q) => !q.isCompleted);
    const completed = filtered.filter((q) => q.isCompleted);
    return [...incomplete, ...completed];
  };

  // ★ CHANGED — completely rewritten. Key idea: moving the toggled quest
  // to the very end of the array (regardless of new status) is enough to
  // correctly position it, because getQuestsByType renders
  // "incomplete-in-array-order" then "completed-in-array-order" — being
  // physically last in the array makes it last within whichever of those
  // two groups it belongs to.
  const toggleQuestCompletion = (questId) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;
    const newCompleted = !quest.isCompleted;

    if (newCompleted) {
      // mark complete right away (checkbox updates instantly)...
      setQuests((prev) =>
        prev.map((q) => (q.id === questId ? { ...q, isCompleted: true } : q))
      );

      // ...but don't move it to the bottom until after a short delay
      setTimeout(() => {
        setQuests((prev) => {
          const target = prev.find((q) => q.id === questId);
          // safety: if the user toggled it back to incomplete before this
          // fired, target.isCompleted will be false — bail out, don't move it
          if (!target || !target.isCompleted) return prev;
          const without = prev.filter((q) => q.id !== questId);
          return [...without, target];
        });
      }, 1500);
    } else {
      // un-completing: flip AND move to the end of the array immediately —
      // lands at the end of the incomplete group / top of the completed group
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
        id: Math.max(0, ...items.map((q) => q.id)) + 1, // simple placeholder id generation
        userId: CURRENT_USER_ID,
        tagId: null,
        date: null,
        time: null,
        isCompleted: false,
        ...questData,
      },
    ]);
  };

  const deleteQuest = (questId) => {
    setQuests((items) => items.filter((q) => q.id !== questId));
  };

  const value = {
    quests,
    questTags,
    getTagById,
    getQuestsByType,
    toggleQuestCompletion,
    addQuest,
    deleteQuest,
  };

  return <QuestsContext.Provider value={value}>{children}</QuestsContext.Provider>;
}

export function useQuests() {
  const ctx = useContext(QuestsContext);
  if (!ctx) throw new Error("useQuests must be used within a QuestsProvider");
  return ctx;
}