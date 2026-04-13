import type { TitleRecord } from "~/entities/titleRecord";

export const calculateNewOrder = (
  reorderedList: TitleRecord[], 
  newIndex: number
): number => {
  const prevItem = reorderedList[newIndex - 1];
  const nextItem = reorderedList[newIndex + 1];

  const prevOrder = prevItem ? Number(prevItem.customOrder) : undefined;
  const nextOrder = nextItem ? Number(nextItem.customOrder) : undefined;

  if (prevOrder !== undefined && nextOrder !== undefined) {
    return Math.floor((prevOrder + nextOrder) / 2);
  }

  if (nextOrder !== undefined) {
    return nextOrder - 100; 
  }

  if (prevOrder !== undefined) {
    return prevOrder + 100;
  }

  return Date.now();
};