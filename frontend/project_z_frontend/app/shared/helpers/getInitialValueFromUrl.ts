export const getInitialValue = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    const params = new URLSearchParams(window.location.search);
    const val = params.get(key);
    
    if (val === null || val === 'undefined' || val === '') return defaultValue;
    return val as unknown as T;
};