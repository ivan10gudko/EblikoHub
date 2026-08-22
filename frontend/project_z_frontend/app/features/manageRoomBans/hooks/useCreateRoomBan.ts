import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomBanService } from "~/features/manageRoomBans/api/roomBanService";
import type { Room } from "~/entities/room/model/room.types";
import { notify } from "~/shared/lib";
import type { RoomBanCreateDto } from "../model/roomBan.types";
import { roomKeys } from "~/entities/room/model/room.keys";
import { roomBanKeys } from "../model/roomBan.keys";

export interface RoomBanItem {
  id: string;
  reason: string;
  createdAt: string;
  user: {
    userId: string;
    name: string;
    nameTag?: string;
    img?: string | null;
  };
}

interface OptimisticBanVariables extends RoomBanCreateDto {
  userData?: {
    name: string;
    nameTag?: string;
    img?: string | null;
  };
}

export const useCreateRoomBan = (roomId: number) => {
  const queryClient = useQueryClient();

  const banListKey = roomBanKeys.bans(roomId);
  const roomDetailsKey = roomKeys.details(roomId);

  return useMutation({
    mutationFn: (variables: OptimisticBanVariables) => {
      const { userId, reason } = variables;
      return roomBanService.create(roomId, { userId, reason });
    },

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: banListKey });
      await queryClient.cancelQueries({ queryKey: roomDetailsKey });

      const previousBans = queryClient.getQueryData<RoomBanItem[]>(banListKey);
      const previousRoom = queryClient.getQueryData<Room>(roomDetailsKey);

      queryClient.setQueryData<RoomBanItem[]>(banListKey, (oldBans) => [
        {
          id: `temp-ban-id-${Date.now()}`,
          reason: variables.reason || "Banned by Admin",
          createdAt: new Date().toISOString(),
          user: {
            userId: variables.userId,
            name: variables.userData?.name || "Processing...",
            nameTag: variables.userData?.nameTag,
            img: variables.userData?.img,
          },
        },
        ...(oldBans || []),
      ]);

      queryClient.setQueryData<Room>(roomDetailsKey, (oldRoom) => {
        if (!oldRoom?.members) return oldRoom;
        return {
          ...oldRoom,
          members: oldRoom.members.filter(
            (member) => String(member.user?.userId) !== String(variables.userId)
          ),
        };
      });

      return { previousBans, previousRoom };
    },

    onError: (error: Error, _variables, context) => {
      if (context?.previousBans) {
        queryClient.setQueryData(banListKey, context.previousBans);
      }
      if (context?.previousRoom) {
        queryClient.setQueryData(roomDetailsKey, context.previousRoom);
      }
      notify.error("Room ban action failed");
      console.error("Room ban action failed:", error.message);
    },

    onSuccess: () => {
      notify.success("User successfully banned");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: banListKey });
      queryClient.invalidateQueries({ queryKey: roomDetailsKey });
      queryClient.invalidateQueries({ queryKey: ["user", roomId] });
    },
  });
};