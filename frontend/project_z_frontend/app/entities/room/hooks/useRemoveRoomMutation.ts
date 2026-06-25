import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomService } from "~/entities/room/api/roomService";
import { notify } from "~/shared/lib";

export const useRemoveRoomMutation = (roomId: number, isOwner: boolean) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => (isOwner ? roomService.delete(roomId) : roomService.leave(roomId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      notify.success(isOwner ? "Room deleted successfully" : "Left the room successfully");
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || "Something went wrong");
    }
  });
};