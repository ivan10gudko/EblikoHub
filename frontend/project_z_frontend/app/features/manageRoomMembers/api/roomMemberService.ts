import type { RoomMember, RoomMemberRoleUpdateDto, UserShort } from "~/entities/room";
import { apiClient } from "~/shared/api";


export interface RoomMemberService {
    getRoomMebmerByRoomIdAndUserId(roomId: number, userId: string): Promise<RoomMember>;
    updateMemberRole(roomId: number, data: RoomMemberRoleUpdateDto): Promise<RoomMember>;
    deleteMembers(id: number, userIds: string[]): Promise<void>;
    leave(id: number): Promise<void>;
    getAcceptedMembers(roomId: number | string): Promise<UserShort[]>;
}

export const roomMemberService: RoomMemberService = {
    async getRoomMebmerByRoomIdAndUserId(roomId, userId) {
        const { data } = await apiClient.get(`rooms/${roomId}/members/${userId}`);
        return data;
    },

    async updateMemberRole(roomId, data) {
        const { data: responseData } = await apiClient.patch<RoomMember>(`rooms/${roomId}/members`, data);
        return responseData;
    },
    async deleteMembers(id, userIds) {
        await apiClient.delete(`/rooms/${id}/members`, { data: userIds });
    },

    async leave(id) {
        await apiClient.delete(`/rooms/${id}/members/leave`);
    },

    async getAcceptedMembers(roomId) {
        const { data } = await apiClient.get(`/rooms/${roomId}/members`);
        return data;
    },
};