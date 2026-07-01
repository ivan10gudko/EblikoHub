import { useQuery } from "@tanstack/react-query";
import { roomMemberService } from "../api/roomMemberService";



export const useRoomMemberByRoomIdAndUserId = (userId: string, roomId : number) => {
    return useQuery({
        queryKey: ["room_member", userId,roomId],
        queryFn: () => userId ? roomMemberService.getRoomMebmerByRoomIdAndUserId(roomId,userId) : Promise.reject("User ID required"),
        enabled: !!userId,
        staleTime: 1000 * 60,
    });
};