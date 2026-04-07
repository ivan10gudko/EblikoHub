import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';

type SyncConfig<T> = {
    [K in keyof T]?: (value: string) => void;
};

export const useSyncUrl = <T extends Record<string, any>>(
    storeValues: T,
    config: SyncConfig<T>
) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            Object.entries(config).forEach(([key, setter]) => {
                const value = searchParams.get(key);
                if (value !== null && setter) {
                    setter(value);
                }
            });
            isFirstRun.current = false;
        }
    }, []); 

    const valuesString = JSON.stringify(storeValues);

    useEffect(() => {
        const nextParams = new URLSearchParams(window.location.search);
        let changed = false;

        Object.entries(storeValues).forEach(([key, val]) => {
            const current = nextParams.get(key);
            
            const isValidValue = val !== undefined && val !== null && val !== '' && val !== 'All';
            const stringVal = isValidValue ? String(val) : '';

            if (isValidValue) {
                if (current !== stringVal) {
                    nextParams.set(key, stringVal);
                    changed = true;
                }
            } else {
                if (nextParams.has(key)) {
                    nextParams.delete(key);
                    changed = true;
                }
            }
        });

        if (changed) {
            setSearchParams(nextParams, { replace: true });
        }
    }, [valuesString, setSearchParams]);
};