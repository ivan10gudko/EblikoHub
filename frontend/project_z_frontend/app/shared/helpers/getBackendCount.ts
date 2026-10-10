
export const getBackendCount = (
  countRecord: Record<string, number> | undefined,
  value: string | undefined
): number => {
  if (!countRecord || value === undefined) return 0;

  
  const cleanClientKey = value.toUpperCase().replace(/[^A-Z]/g, "");

  const foundKey = Object.keys(countRecord).find((key) => {
    
    const cleanServerKey = key.toUpperCase().replace(/[^A-Z]/g, "");
    return cleanServerKey === cleanClientKey;
  });

  return foundKey ? countRecord[foundKey] : 0;
};