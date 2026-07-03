import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomTitleService } from "~/features/manageRooms/api/roomTitleService";
import { notify } from "~/shared/lib";
import type { RoomTitleCreateRequest, RoomTitleDetails } from "../model/roomTitle.types";

export const useRoomTitleActions = (roomId: number) => {
  const queryClient = useQueryClient();
  const queryKey = ["roomTitles", roomId];

  const mutationConfig = {
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: () => notify.error("Something went wrong"),
  };

  const createMutation = useMutation({
    ...mutationConfig,
    mutationFn: (data: RoomTitleCreateRequest) => roomTitleService.createTitle(roomId, data),
  });

  const deleteMutation = useMutation({
    ...mutationConfig,
    mutationFn: (titleId: string) => roomTitleService.deleteTitle(roomId, titleId),
  });

  const updateMutation = useMutation({
    ...mutationConfig,
    mutationFn: ({ titleId, data }: { titleId: string; data: RoomTitleCreateRequest }) => 
      roomTitleService.updateTitle(roomId, titleId, data),
  });

  return {
    addTitle: createMutation.mutateAsync,
    deleteTitle: deleteMutation.mutateAsync,
    updateTitle: updateMutation.mutateAsync,
    isPending: createMutation.isPending || deleteMutation.isPending || updateMutation.isPending,
  };
};