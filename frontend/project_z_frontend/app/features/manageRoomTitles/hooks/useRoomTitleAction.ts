import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { roomTitleService } from "~/features/manageRoomTitles/api/roomTitleService";
import { notify } from "~/shared/lib";
import type { RoomTitleCreateRequest, RoomTitleWithUserLinks } from "../model/roomTitle.types";
import type { PageResponse } from "~/shared/types";
import { updateInfiniteQuery } from "~/shared/helpers/updateInfinityQuery";
import { getErrorMessage } from "~/shared/utils";
import { roomTitleKeys } from "../model/roomTitle.queryKeys";

export const useRoomTitleActions = (roomId: number) => {
  const queryClient = useQueryClient();
  const withLinksQueryKey = roomTitleKeys.withLinksBase(roomId);

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: [...roomTitleKeys.all, roomId] });
    queryClient.invalidateQueries({ queryKey: withLinksQueryKey });
    queryClient.invalidateQueries({ queryKey: ["room-links", roomId] });
  };

  const onError = (error: unknown) => {
    notify.error(getErrorMessage(error, "Something went wrong"));
  };

  const createMutation = useMutation({
    mutationFn: (data: RoomTitleCreateRequest) => roomTitleService.createTitle(roomId, data),

    onMutate: async (newTitleData) => {
      await queryClient.cancelQueries({ queryKey: withLinksQueryKey });
      await queryClient.cancelQueries({ queryKey: [...roomTitleKeys.all, roomId] });

      queryClient.setQueriesData<InfiniteData<PageResponse<RoomTitleWithUserLinks>>>(
        { queryKey: withLinksQueryKey },
        (oldData) => {
          if (!oldData) return undefined;

          const optimisticTitle: RoomTitleWithUserLinks = {
            id: "temp-title-id-" + Date.now(),
            titleName: newTitleData.titleName || "New Title",
            imageUrl: newTitleData.imageUrl || "",
            titleType: newTitleData.titleType,
            apiTitleId: newTitleData.apiTitleId || 0,
            addedByUserId: "",
            links: [],
            createdAt: new Date().toISOString(),
          };

          return updateInfiniteQuery<PageResponse<RoomTitleWithUserLinks>, RoomTitleWithUserLinks>({
            oldData,
            getContent: (page) => page.content,
            setContent: (page, newContent) => ({ ...page, content: newContent }),
            updater: (allItems) => [optimisticTitle, ...allItems],
          });
        }
      );
    },
    onSuccess: () => {
      notify.success("Room title added!");
    },
    onError,
    onSettled: invalidateAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (titleId: string) => roomTitleService.deleteTitle(roomId, titleId),
    onError,
    onSettled: invalidateAll,
  });

  const updateMutation = useMutation({
    mutationFn: ({ titleId, data }: { titleId: string; data: RoomTitleCreateRequest }) =>
      roomTitleService.updateTitle(roomId, titleId, data),
    onError,
    onSettled: invalidateAll,
  });

  return {
    addTitle: createMutation.mutateAsync,
    deleteTitle: deleteMutation.mutateAsync,
    updateTitle: updateMutation.mutateAsync,
    isPending: createMutation.isPending || deleteMutation.isPending || updateMutation.isPending,
  };
};