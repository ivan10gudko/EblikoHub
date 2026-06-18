import { useState, useEffect, useRef } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { titleRecordService, type TitleRecord } from "~/entities/titleRecord";
import { calculateNewOrder } from "~/shared/helpers";
import type { PageResponse } from "~/shared/types";
import { useSearchParams } from "react-router";
import { notify } from "~/shared/lib";
import { updateInfiniteQuery } from "~/shared/helpers/updateInfinityQuery";

export const useReorderWatchlist = (titles: TitleRecord[], queryKey: unknown[], userId: string | undefined) => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [optimisticTitles, setOptimisticTitles] = useState<TitleRecord[]>(titles);
  const isMutating = useRef(false);
  const optimisticOrderRef = useRef<number[]>(titles.map(t => t.titleId));

  useEffect(() => {
    if (isMutating.current) return;

    const unique = titles.filter(
      (t, i, arr) => arr.findIndex(x => x.titleId === t.titleId) === i
    );
    setOptimisticTitles(unique);
    optimisticOrderRef.current = unique.map(t => t.titleId);
  }, [titles]);

  const reorder = async (sourceIndex: number, destinationIndex: number) => {
    const reordered = Array.from(optimisticTitles);
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(destinationIndex, 0, moved);

    const movedTitleId = optimisticTitles[sourceIndex].titleId;
    const isDesc = (searchParams.get('order') || 'asc') === 'desc';
    const newOrderValue = calculateNewOrder(reordered, destinationIndex, movedTitleId, isDesc);

    if (newOrderValue === null) {
      if (!userId) return;
      await titleRecordService.reindexCustomOrder(userId);
      await queryClient.invalidateQueries({ queryKey });
      return;
    }
    moved.customOrder = newOrderValue;
    isMutating.current = true;
    optimisticOrderRef.current = reordered.map(t => t.titleId);
    setOptimisticTitles(reordered);

    queryClient.setQueryData<InfiniteData<PageResponse<TitleRecord>>>(
      queryKey,
      (oldData) => updateInfiniteQuery(
        oldData,
        (page) => page.content, // Як дістати
        (page, newContent) => ({ ...page, content: newContent }), // Як вставити
        (allItems) => {
          const movedItemIndex = allItems.findIndex(item => item.titleId === movedTitleId);
          if (movedItemIndex === -1) return allItems;

          const [movedItem] = allItems.splice(movedItemIndex, 1);
          const reordered = [...allItems];
          reordered.splice(destinationIndex, 0, { ...movedItem, customOrder: newOrderValue });
          return reordered;
        }
      )
    );

    try {
      await titleRecordService.patchCustomOrder(movedTitleId, newOrderValue);
    } catch {
      optimisticOrderRef.current = titles.map(t => t.titleId);
      setOptimisticTitles(titles);
      queryClient.invalidateQueries({ queryKey });
      notify.error("Failed to save position");
    } finally {
      isMutating.current = false;
    }
  };

  return { reorder, optimisticTitles };
};