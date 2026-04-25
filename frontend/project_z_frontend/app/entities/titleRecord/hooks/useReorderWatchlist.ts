import { useState, useEffect, useRef } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { titleRecordService, type TitleRecord } from "~/entities/titleRecord";
import { calculateNewOrder } from "~/shared/helpers";
import type { PageResponse } from "~/shared/types";
import { useSearchParams } from "react-router";

export const useReorderWatchlist = (titles: TitleRecord[], queryKey: unknown[], userId: string | undefined) => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [optimisticTitles, setOptimisticTitles] = useState<TitleRecord[]>(titles);
  const isMutating = useRef(false);
  const optimisticOrderRef = useRef<number[]>(titles.map(t => t.titleId));

  useEffect(() => {
    const incomingIds = titles.map(t => t.titleId).join(',');
    const currentIds = optimisticOrderRef.current.join(',');

    if (incomingIds !== currentIds) {
      isMutating.current = false;
      // дедуплікація на випадок якщо щось пішло не так
      const unique = titles.filter(
        (t, i, arr) => arr.findIndex(x => x.titleId === t.titleId) === i
      );
      setOptimisticTitles(unique);
      optimisticOrderRef.current = unique.map(t => t.titleId);
    }
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
      (oldData) => {
        if (!oldData) return oldData;
        const pageSize = oldData.pages[0]?.content.length || 10;
        const allItems = oldData.pages.flatMap((p) => p.content);
        const itemInCache = allItems.find(item => item.titleId === movedTitleId);
        if (itemInCache) {
          itemInCache.customOrder = newOrderValue;
        }
        const [movedItem] = allItems.splice(sourceIndex, 1);
        allItems.splice(destinationIndex, 0, movedItem);
        return {
          ...oldData,
          pages: oldData.pages.map((page, pageIdx) => ({
            ...page,
            content: allItems.slice(pageIdx * pageSize, (pageIdx + 1) * pageSize),
          })),
        };
      }
    );

    try {
      await titleRecordService.patchCustomOrder(movedTitleId, newOrderValue);
    } catch {
      optimisticOrderRef.current = titles.map(t => t.titleId);
      setOptimisticTitles(titles);
      queryClient.invalidateQueries({ queryKey });
      toast.error("Failed to save position");
    } finally {
      isMutating.current = false;
    }
  };

  return { reorder, optimisticTitles };
};