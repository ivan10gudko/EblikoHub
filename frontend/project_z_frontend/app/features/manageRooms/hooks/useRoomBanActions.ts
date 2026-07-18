import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomBanService } from "~/features/manageRooms/api/roomBanService"; 
import type { RoomBanCreateDto } from "../model/roomTitle.types"; 
import type { Room } from "~/entities/room/model/room.types";
import { notify } from "~/shared/lib";

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

export const useRoomBanActions = (roomId: number) => {
  const queryClient = useQueryClient();
  
  const banListKey = ['rooms', roomId, 'bans'];
  const roomDetailsKey = ["room", roomId];

  // 1. Мутація для створення бану
  const createMutation = useMutation({
    mutationFn: (variables: OptimisticBanVariables) => {
      const { userId, reason } = variables;
      return roomBanService.create(roomId, { userId, reason });
    },
    
    onMutate: async (variables) => {
      // Скасовуємо активні запити для обох ключів
      await queryClient.cancelQueries({ queryKey: banListKey });
      await queryClient.cancelQueries({ queryKey: roomDetailsKey });

      // Зберігаємо старі стани для відкату
      const previousBans = queryClient.getQueryData<RoomBanItem[]>(banListKey);
      const previousRoom = queryClient.getQueryData<Room>(roomDetailsKey);

      // ОПТИМІСТИЧНО 1: Додаємо користувача в список забанених
      queryClient.setQueryData<RoomBanItem[]>(banListKey, (oldBans) => {
        const currentBans = oldBans || [];
        const optimisticBan: RoomBanItem = {
          id: `temp-ban-id-${Date.now()}`,
          reason: variables.reason || "Banned by Admin",
          createdAt: new Date().toISOString(),
          user: {
            userId: variables.userId,
            name: variables.userData?.name || "Processing...",
            nameTag: variables.userData?.nameTag,
            img: variables.userData?.img,
          }
        };
        return [optimisticBan, ...currentBans];
      });

      // ОПТИМІСТИЧНО 2: Видаляємо користувача зі списку учасників кімнати
      queryClient.setQueryData<Room>(roomDetailsKey, (oldRoom) => {
        if (!oldRoom || !oldRoom.members) return oldRoom;
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
      // Відкат обох стейтів у разі помилки
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
      // Синхронізуємо з сервером
      queryClient.invalidateQueries({ queryKey: banListKey });
      queryClient.invalidateQueries({ queryKey: roomDetailsKey });
      queryClient.invalidateQueries({ queryKey: ['user', roomId] });
    },
  });

  // 2. Мутація для зняття бану
  const unbanMutation = useMutation({
    mutationFn: (roomBanId: string) => roomBanService.unban(roomId, roomBanId),

    onMutate: async (roomBanId) => {
      await queryClient.cancelQueries({ queryKey: banListKey });
      const previousBans = queryClient.getQueryData<RoomBanItem[]>(banListKey);

      // Оптимістично видаляємо з чорного списку
      queryClient.setQueryData<RoomBanItem[]>(banListKey, (oldBans) => {
        if (!oldBans) return [];
        return oldBans.filter((ban) => String(ban.id) !== String(roomBanId));
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
      queryClient.invalidateQueries({ queryKey: roomDetailsKey }); // Перезапитуємо деталі кімнати, щоб повернути користувача
      queryClient.invalidateQueries({ queryKey: ['user', roomId] });
    },
  });

  return {
    banUser: createMutation.mutate,
    unbanUser: unbanMutation.mutate,
    isPending: createMutation.isPending || unbanMutation.isPending,
  };
};