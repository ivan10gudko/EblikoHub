import { QueryClient, useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { roomService } from "~/entities/room/api/roomService";
import type { RoomShort } from "~/entities/room/model/room.types";
import type { PageResponse } from "~/shared/types";
import { notify } from "~/shared/lib";
import { updateInfiniteQuery } from "~/shared/helpers/updateInfinityQuery";


export const useRoomActions = (roomId: number) => {
  const queryClient = useQueryClient();
  const queryKey = ['rooms'];

  type MutationContext = { previousData: InfiniteData<PageResponse<RoomShort>> | undefined };

  const mutationConfig = {
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
    onError: (
      _err: unknown,
      _variables: void,
      context: MutationContext | undefined
    ) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      notify.error("Something went wrong");
    }
  };

  const updateRoomCache = (updater: (content: RoomShort[]) => RoomShort[]) => {
    queryClient.setQueryData<InfiniteData<PageResponse<RoomShort>>>(queryKey, (oldData) =>
      updateInfiniteQuery({
        oldData,
        getContent: (page) => page.content,
        setContent: (page, newContent) => ({ ...page, content: newContent }),
        updater
      })
    );
  };

  const pinMutation = useMutation({
    ...mutationConfig,
    mutationFn: () => roomService.pinRoom(roomId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<InfiniteData<PageResponse<RoomShort>>>(queryKey);

      updateRoomCache((content) =>
        content.map(r => ({ ...r, isPinned: r.roomId === roomId }))
      );

      return { previousData };
    }
  });

  const unpinMutation = useMutation({
    ...mutationConfig,
    mutationFn: () => roomService.unpin(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<InfiniteData<PageResponse<RoomShort>>>(queryKey);

      updateRoomCache((content) =>
        content.map(r => ({ ...r, isPinned: false }))
      );

      return { previousData };
    }
  });

  return {
    pinRoom: pinMutation.mutate,
    unpinRoom: unpinMutation.mutate,
    isPending: pinMutation.isPending || unpinMutation.isPending
  };
};