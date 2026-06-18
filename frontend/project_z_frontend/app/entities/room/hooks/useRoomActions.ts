import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { roomService } from "~/entities/room/api/roomService";
import type { RoomShort } from "~/entities/room/model/room.types";
import type { PageResponse } from "~/shared/types";
import { notify } from "~/shared/lib";

export const useRoomActions = (roomId: number) => {
  const queryClient = useQueryClient();
  const queryKey = ['rooms'];

  const pinMutation = useMutation({
    mutationFn: () => roomService.pinRoom(roomId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<InfiniteData<PageResponse<RoomShort>>>(queryKey);
      
      queryClient.setQueryData<InfiniteData<PageResponse<RoomShort>>>(queryKey, (old) => {
        if (!old) return old;
        return { ...old, pages: old.pages.map(page => ({ ...page, content: page.content.map(room => ({ ...room, isPinned: room.roomId === roomId })) })) };
      });
      return { previousData };
    },
    onError: (_, __, context) => { queryClient.setQueryData(queryKey, context?.previousData); notify.error("Failed to pin"); },
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  });

  const unpinMutation = useMutation({
    mutationFn: () => roomService.unpin(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<InfiniteData<PageResponse<RoomShort>>>(queryKey);
      
      queryClient.setQueryData<InfiniteData<PageResponse<RoomShort>>>(queryKey, (old) => {
        if (!old) return old;
        return { ...old, pages: old.pages.map(page => ({ ...page, content: page.content.map(room => ({ ...room, isPinned: false })) })) };
      });
      return { previousData };
    },
    onError: (_, __, context) => { queryClient.setQueryData(queryKey, context?.previousData); notify.error("Failed to unpin"); },
    onSettled: () => queryClient.invalidateQueries({ queryKey })
  });

  return {
    pinRoom: pinMutation.mutate,
    unpinRoom: unpinMutation.mutate,
    isPending: pinMutation.isPending || unpinMutation.isPending
  };
};