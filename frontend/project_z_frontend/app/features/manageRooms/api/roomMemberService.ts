import type { RoomMember } from "~/entities/room";
import { apiClient } from "~/shared/api";

export interface RoomMemberService {
    getRoomMebmerByRoomIdAndUserId(roomId: number, userId:string ): Promise<RoomMember>;
}
export const roomMemberService: RoomMemberService = {
    async getRoomMebmerByRoomIdAndUserId(roomId, userId) {
        const { data } = await apiClient.get(`rooms/${roomId}/members/${userId}`);
        return data;
    },
}