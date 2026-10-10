import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomBanService } from "~/features/manageRoomBans/api/roomBanService";
import { notify } from "~/shared/lib";
import { roomKeys } from "~/entities/room/model/room.keys";
import { roomBanKeys } from "../model/roomBan.keys";
import type { RoomBanDetailsDto } from "../model/roomBan.types";

export const useDeleteRoomBan = (roomId: number) => {
  const queryClient = useQueryClient();

  const banListKey = roomBanKeys.bans(roomId);
  const roomDetailsKey = roomKeys.details(roomId);

  return useMutation({
    mutationFn: (roomBanId: string) => roomBanService.unban(roomId, roomBanId),

    onMutate: async (roomBanId) => {
      await queryClient.cancelQueries({ queryKey: banListKey });
      const previousBans = queryClient.getQueryData<RoomBanDetailsDto[]>(banListKey);

      queryClient.setQueryData<RoomBanDetailsDto[]>(banListKey, (oldBans) => {
        if (!oldBans) return [];
        return oldBans.filter((ban) => ban.id !== roomBanId);
      });

      return { previousBans };
    },

    onError: (error: Error, _variables, context) => {
      if (context?.previousBans) {
        queryClient.setQueryData(banListKey, context.previousBans);
      }
      notify.error("Room unban action failed");
      console.error("Room unban action failed:", error.message);
    },

    onSuccess: () => {
      notify.success("User successfully unbanned");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: banListKey });
      queryClient.invalidateQueries({ queryKey: roomDetailsKey });
      queryClient.invalidateQueries({ queryKey: ["user", roomId] });
    },
  });
};