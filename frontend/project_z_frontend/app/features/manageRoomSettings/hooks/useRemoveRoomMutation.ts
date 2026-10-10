import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomService } from "~/entities/room/api/roomService";
import { roomMemberService } from "~/features/manageRoomMembers";
import { notify } from "~/shared/lib";
import { getErrorMessage } from "~/shared/utils";

export const useRemoveRoomMutation = (roomId: number, isOwner: boolean) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => (isOwner ? roomService.delete(roomId) : roomMemberService.leave(roomId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      notify.success(isOwner ? "Room deleted successfully" : "Left the room successfully");
    },
    onError: (error: unknown) => {
      notify.error(getErrorMessage(error, "Something went wrong"));
    }
  });
};