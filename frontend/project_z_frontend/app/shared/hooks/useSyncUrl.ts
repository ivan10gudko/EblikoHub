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
            const hasUrlParams = Array.from(searchParams.keys()).length > 0;

            if (hasUrlParams) {

                Object.entries(config).forEach(([key, setter]) => {
                    const value = searchParams.get(key);
                    if (value !== null && setter) {
                        setter(value);
                    }
                });
            } else {

                const nextParams = new URLSearchParams();
                let shouldUpdateUrl = false;

                Object.entries(storeValues).forEach(([key, val]) => {
                    const isArray = Array.isArray(val);
                    const isValid = isArray
                        ? val.length > 0
                        : (val !== undefined && val !== null && val !== '' && val !== 'All' && val !== 1);

                    if (isValid) {
                        nextParams.set(key, isArray ? val.join(',') : String(val));
                        shouldUpdateUrl = true;
                    }
                });

                if (shouldUpdateUrl) {
                    setSearchParams(nextParams, { replace: true });
                }
            }
            isFirstRun.current = false;
        }
    }, [searchParams, config]);

    const valuesDependencies = Object.entries(storeValues)
        .map(([k, v]) => `${k}:${Array.isArray(v) ? v.join(',') : v}`)
        .join('|');

    useEffect(() => {
        if (isFirstRun.current) return;

        const nextParams = new URLSearchParams(window.location.search);
        let changed = false;

        Object.entries(storeValues).forEach(([key, val]) => {
            const current = nextParams.get(key);

            const isArray = Array.isArray(val);
            const isValidValue = isArray
                ? val.length > 0
                : val !== undefined && val !== null && val !== '' && val !== 'All';

            const stringVal = isValidValue
                ? (isArray ? val.join(',') : String(val))
                : '';

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
    }, [valuesDependencies, setSearchParams]);
};