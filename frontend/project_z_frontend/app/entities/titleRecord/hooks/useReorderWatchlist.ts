import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { titleRecordService, type TitleRecord } from "~/entities/titleRecord";
import { calculateNewOrder } from "~/shared/helpers";
import type { PageResponse } from "~/shared/types";

export const useReorderWatchlist = (titles: TitleRecord[], queryKey: any[]) => {
  const PAGE_SIZE = 10;
  const queryClient = useQueryClient();

  const reorder = async (sourceIndex: number, destinationIndex: number) => {
    const reorderedItems = Array.from(titles);
    const [movedItem] = reorderedItems.splice(sourceIndex, 1);
    reorderedItems.splice(destinationIndex, 0, movedItem);

    const movedTitleId = titles[sourceIndex].titleId;
    const newOrderValue = calculateNewOrder(reorderedItems, destinationIndex);

    // Оновлюємо ТІЛЬКИ конкретний запит за повним ключем
    queryClient.setQueryData<InfiniteData<PageResponse<TitleRecord>>>(
      queryKey, 
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page, pageIdx) => ({
            ...page,
            content: reorderedItems.slice(pageIdx * PAGE_SIZE, (pageIdx + 1) * PAGE_SIZE),
          })),
        };
      }
    );

    // 3. Запит на бекенд
    try {
      await titleRecordService.patchCustomOrder(movedTitleId, newOrderValue);
    } catch (err) {
      queryClient.invalidateQueries({ queryKey });
      toast.error("Failed to save position");
    }
  };

  return { reorder };
};