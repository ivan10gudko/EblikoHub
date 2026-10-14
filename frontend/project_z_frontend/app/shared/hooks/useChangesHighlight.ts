import { useEffect, useRef, useState } from "react";

export type ChangedFields<T> = Partial<Record<keyof T, boolean>>;

export const useChangesHighlight = <T extends Record<string, unknown>>(
    data: T | undefined | null,
    watchKeys: (keyof T)[],
    duration = 1500
) => {
    const prevDataRef = useRef<T | undefined | null>(undefined);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const watchKeysRef = useRef(watchKeys);
    watchKeysRef.current = watchKeys;

    const [changedFields, setChangedFields] = useState<ChangedFields<T>>({});

    useEffect(() => {
        const prev = prevDataRef.current;
        prevDataRef.current = data;
        if (!prev || !data || prev === data) return;

        const newChanges: ChangedFields<T> = {};
        let hasChanges = false;

        for (const key of watchKeysRef.current) {
            if (prev[key] !== data[key]) {
                newChanges[key] = true;
                hasChanges = true;
            }
        }

        if (hasChanges) {
            setChangedFields(newChanges);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setChangedFields({}), duration);
        }
    }, [data, duration]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return changedFields;
};