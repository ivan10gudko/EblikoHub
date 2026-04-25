import type { TitleRecord } from "~/entities/titleRecord";

export const calculateNewOrder = (
  reorderedList: TitleRecord[], 
  newIndex: number,
  movedTitleId: number,
  isDesc: boolean = false 
): number | null => {
  const cleanList = reorderedList.filter(item => item.titleId !== movedTitleId);
  
  const prevItem = cleanList[newIndex - 1];
  const nextItem = cleanList[newIndex];

  const prevOrder = prevItem ? Number(prevItem.customOrder) : null;
  const nextOrder = nextItem ? Number(nextItem.customOrder) : null;

  if (prevOrder === null && nextOrder !== null) {
    return isDesc ? nextOrder + 1000000 : nextOrder - 1000000;
  }

  if (prevOrder !== null && nextOrder === null) {
    return isDesc ? prevOrder - 1000000 : prevOrder + 1000000;
  }

  if (prevOrder !== null && nextOrder !== null) {
    if (Math.abs(nextOrder - prevOrder) < 0.000001) return null;
    return (prevOrder + nextOrder) / 2;
  }

  return 1000000;
};