import { useState, useEffect, useRef } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { titleRecordService, type TitleRecord } from "~/entities/titleRecord";
import { calculateNewOrder } from "~/shared/helpers";
import type { PageResponse } from "~/shared/types";
import { useSearchParams } from "react-router";
import { notify } from "~/shared/lib";
import { updateInfiniteQuery } from "~/shared/helpers/updateInfinityQuery";
import type { SortOrder } from "~/shared/types/api";

export const useReorderWatchlist = (titles: TitleRecord[], queryKey: unknown[], userId: string | undefined) => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [optimisticTitles, setOptimisticTitles] = useState<TitleRecord[]>(titles);
  const isMutating = useRef(false);

  const sortMode: SortOrder = searchParams.get("order") === "desc" ? "desc" : "asc";
  const isDesc = sortMode === "desc";

  useEffect(() => {
    if (isMutating.current) return;

    const unique = titles.filter(
      (t, i, arr) => arr.findIndex(x => x.titleId === t.titleId) === i
    );
    setOptimisticTitles(unique);
  }, [titles]);

  const reorder = async (sourceIndex: number, destinationIndex: number) => {
    const pinnedItems = optimisticTitles.filter((t) => t.pinned);
    const regular = optimisticTitles.filter((t) => !t.pinned);

    const reordered = Array.from(regular);
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(destinationIndex, 0, moved);

    const movedTitleId = moved.titleId;
    const newOrderValue = calculateNewOrder(reordered, destinationIndex, movedTitleId, isDesc);

    if (newOrderValue === null) {
      if (!userId) return;
      await titleRecordService.reindexCustomOrder(userId);
      await queryClient.invalidateQueries({ queryKey });
      return;
    }

    isMutating.current = true;

    reordered[destinationIndex] = { ...moved, customOrder: newOrderValue };
    setOptimisticTitles([...pinnedItems, ...reordered]);

    queryClient.setQueryData<InfiniteData<PageResponse<TitleRecord>>>(
      queryKey,
      (oldData) =>
        updateInfiniteQuery({
          oldData,
          getContent: (page) => page.content,
          setContent: (page, newContent) => ({ ...page, content: newContent }),
          updater: (allItems) => {
            const movedItem = allItems.find((i) => i.titleId === movedTitleId);
            if (!movedItem) return allItems;

            const pinned = allItems.filter((i) => i.pinned);
            const rest = allItems.filter(
              (i) => !i.pinned && i.titleId !== movedTitleId
            );
            rest.splice(destinationIndex, 0, { ...movedItem, customOrder: newOrderValue });
            return [...pinned, ...rest];
          },
        })
    );

    try {
      await titleRecordService.patchCustomOrder(movedTitleId, {
        customOrder: newOrderValue,
        newIndex: destinationIndex,
        sortMode,
      });
    } catch {
      setOptimisticTitles(titles);
      await queryClient.invalidateQueries({ queryKey });
      notify.error("Failed to save position");
    } finally {
      isMutating.current = false;
    }
  };

  return { reorder, optimisticTitles };
};