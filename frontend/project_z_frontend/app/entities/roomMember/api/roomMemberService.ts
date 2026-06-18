
import { apiClient } from "~/shared/api";
import type { MemberShortDto, RoomMemberDto } from "../model/roomMember.types";
import type { RequestStatus, RequestType } from "~/shared/types";


interface RoomMemberService {
    getAcceptedMembers(roomId: string): Promise<MemberShortDto[]>;
    getRequests(roomId: string, status: RequestStatus, type: RequestType): Promise<RoomMemberDto[]>;
    joinRoom(roomId: string): Promise<void>;
    inviteUser(roomId: string, receiverId: string): Promise<void>;
    acceptRequest(roomId: string, receiverId: string): Promise<void>;
    rejectRequest(roomId: string, receiverId: string): Promise<void>;
    leaveRoom(roomId: string): Promise<void>;
}

export const roomMemberService: RoomMemberService = {
    async getAcceptedMembers(roomId) {
        const response = await apiClient.get<MemberShortDto[]>(`/rooms/${roomId}/members`);
        return response.data;
    },

    async getRequests(roomId, status, type) {
        const response = await apiClient.get<RoomMemberDto[]>(`/rooms/${roomId}/members/requests`, {
            params: { status, type }
        });
        return response.data;
    },

    async joinRoom(roomId) {
        await apiClient.post(`/rooms/${roomId}/members/join`);
    },

    async inviteUser(roomId, receiverId) {
        await apiClient.post(`/rooms/${roomId}/members/invite/${receiverId}`);
    },

    async acceptRequest(roomId, receiverId) {
        await apiClient.put(`/rooms/${roomId}/members/accept/${receiverId}`);
    },

    async rejectRequest(roomId, receiverId) {
        await apiClient.put(`/rooms/${roomId}/members/reject/${receiverId}`);
    },

    async leaveRoom(roomId) {
        await apiClient.delete(`/rooms/${roomId}/members/leave`);
    }
};