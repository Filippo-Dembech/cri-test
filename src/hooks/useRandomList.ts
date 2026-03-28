import { useCallback, useEffect, useRef, useState } from "react";

function shuffle<T>(array: T[]): T[] {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

interface UseRandomListOptions {
    infinite?: boolean;
}

export function useRandomList<T>(
    items: T[],
    { infinite = true }: UseRandomListOptions = {},
) {
    const queueRef = useRef<T[]>([]);
    const itemsRef = useRef(items);

    const [current, setCurrent] = useState<T | undefined>(undefined);
    const [isExhausted, setIsExhausted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const refillQueue = useCallback(() => {
        queueRef.current = shuffle(itemsRef.current);
    }, []);

    const next = useCallback(() => {
        if (queueRef.current.length === 0) {
            if (!infinite) {
                setIsExhausted(true);
                setCurrent(undefined);
                return;
            }
            refillQueue();
        }

        const nextItem = queueRef.current.shift() ?? undefined;
        setCurrent(nextItem);
        setCurrentIndex(prev => prev + 1);
    }, [infinite, refillQueue]);

    const reset = useCallback(() => {
      setCurrentIndex(0);
        setIsExhausted(false);
        refillQueue();
        const first = queueRef.current.shift() ?? undefined;
        setCurrent(first);
    }, [refillQueue]);

    useEffect(() => {
        itemsRef.current = items;
        setIsExhausted(false);
        refillQueue();
        const first = queueRef.current.shift() ?? undefined;
        setCurrent(first);
    }, [items, refillQueue]);

    return { current, currentIndex, next, isExhausted, reset };
}
