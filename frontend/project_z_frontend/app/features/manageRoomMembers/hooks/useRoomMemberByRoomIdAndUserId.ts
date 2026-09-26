import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { roomMemberService } from "../api/roomMemberService";

export const useRoomMemberByRoomIdAndUserId = (
  userId: string | null | undefined,
  roomId: number
) => {
  return useQuery({
    queryKey: ["room_member", userId, roomId],
    queryFn: async () => {
      try {
        return await roomMemberService.getRoomMebmerByRoomIdAndUserId(roomId, userId!);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: Boolean(userId && roomId),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};