import type { RoomMember, RoomMemberRoleUpdateDto } from "~/entities/room";
import { apiClient } from "~/shared/api";


export interface RoomMemberService {
    getRoomMebmerByRoomIdAndUserId(roomId: number, userId: string): Promise<RoomMember>;
    updateMemberRole(roomId: number, data: RoomMemberRoleUpdateDto): Promise<RoomMember>;
}

export const roomMemberService: RoomMemberService = {
    async getRoomMebmerByRoomIdAndUserId(roomId, userId) {
        const { data } = await apiClient.get(`rooms/${roomId}/members/${userId}`);
        return data;
    },

    async updateMemberRole(roomId, data) {
        // Використовуємо твій apiClient замість абстрактного api
        const { data: responseData } = await apiClient.patch<RoomMember>(`rooms/${roomId}/members`, data);
        return responseData;
    },
};