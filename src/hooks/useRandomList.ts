import { useCallback, useEffect, useRef, useState } from "react";

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

export function useRandomList<T>(items: T[]) {
  const queueRef = useRef<T[]>([]);
  const itemsRef = useRef(items);

  const [current, setCurrent] = useState<T | undefined>(undefined);

  const refillQueue = useCallback(() => {
    queueRef.current = shuffle(itemsRef.current);
  }, []);

  const next = useCallback(() => {
    if (queueRef.current.length === 0) {
      refillQueue();
    }

    const nextItem = queueRef.current.shift() ?? undefined;
    setCurrent(nextItem);
  }, [refillQueue]);

  useEffect(() => {
    itemsRef.current = items;
    refillQueue();
    const first = queueRef.current.shift() ?? undefined;
    setCurrent(first);
  }, [items, refillQueue]);

  return { current, next };
}