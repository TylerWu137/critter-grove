import { useState, useRef, useEffect, useCallback } from "react";

// Tracks whether a scrollable element currently has hidden content above
// (canScrollUp) or below (canScrollDown) the visible viewport. Pass a
// dependency array (e.g. [items.length]) so it re-checks when content
// that could change scrollHeight changes.
export function useScrollEdges(dependencies = []) {
  const ref = useRef(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkEdges = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setCanScrollUp(scrollTop > 1);
    setCanScrollDown(scrollTop + clientHeight < scrollHeight - 1);
  }, []);

  useEffect(() => {
    checkEdges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { ref, canScrollUp, canScrollDown, onScroll: checkEdges };
}