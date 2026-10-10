import { useEffect, useRef, useCallback } from "react";

export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
) {
    const callbackRef = useRef(callback);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const clear = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    }, []);

    const debouncedFn = useCallback(
        (...args: Parameters<T>) => {
            clear();
            timerRef.current = setTimeout(() => {
                callbackRef.current(...args);
            }, delay);
        },
        [delay, clear]
    );

    useEffect(() => {
        return clear;
    }, [clear]);

    return [debouncedFn, clear] as const;
}