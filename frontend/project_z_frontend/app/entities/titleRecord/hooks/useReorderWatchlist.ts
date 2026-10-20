import { useState } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { titleRecordService, type TitleRecord } from "~/entities/titleRecord";
import { calculateNewOrder } from "~/shared/helpers";
import type { PageResponse } from "~/shared/types";
import { useSearchParams } from "react-router";
import { notify } from "~/shared/lib";
import { updateInfiniteQuery } from "~/shared/helpers/updateInfinityQuery";
import type { SortOrder } from "~/shared/types/api";

export const useReorderWatchlist = (
  titles: TitleRecord[],
  queryKey: unknown[],
  userId: string | undefined
) => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [override, setOverride] = useState<TitleRecord[] | null>(null);

  const optimisticTitles = override ?? titles;

  const sortMode: SortOrder = searchParams.get("order") === "desc" ? "desc" : "asc";
  const isDesc = sortMode === "desc";

  const reorder = async (sourceIndex: number, destinationIndex: number) => {
    const pinned = optimisticTitles[0]?.pinned ? optimisticTitles[0] : null;
    const regular = pinned ? optimisticTitles.slice(1) : optimisticTitles;

    const reordered = regular.slice();
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

    const updatedMoved = { ...moved, customOrder: newOrderValue };
    reordered[destinationIndex] = updatedMoved;
    setOverride(pinned ? [pinned, ...reordered] : reordered);

    const cacheOffset = pinned ? 1 : 0;
    queryClient.setQueryData<InfiniteData<PageResponse<TitleRecord>>>(
      queryKey,
      (oldData) =>
        updateInfiniteQuery({
          oldData,
          getContent: (page) => page.content,
          setContent: (page, newContent) => ({ ...page, content: newContent }),
          updater: (allItems) => {
            const next = allItems.filter((i) => i.titleId !== movedTitleId);
            next.splice(destinationIndex + cacheOffset, 0, updatedMoved);
            return next;
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
      await queryClient.invalidateQueries({ queryKey });
      notify.error("Failed to save position");
    } finally {
      setOverride(null);
    }
  };

  return { reorder, optimisticTitles };
};