import { useQuery } from "@tanstack/react-query";
import { roomMemberService } from "../api/roomMemberService";

export const useRoomMemberByRoomIdAndUserId = (
    userId: string | null | undefined,
    roomId: number
) => {
    return useQuery({
        queryKey: ["room_member", userId, roomId],
        queryFn: () => roomMemberService.getRoomMebmerByRoomIdAndUserId(roomId, userId!),
        enabled: Boolean(userId && roomId),
        staleTime: 1000 * 60,
    });
};