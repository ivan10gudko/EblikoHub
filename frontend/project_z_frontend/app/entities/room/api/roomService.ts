import { apiClient } from "~/shared/api";
import type { MemberShort, Room, RoomCreateDto, RoomMemberDto, RoomQueryParameters, RoomShort } from "../model/room.types";
import type { PageResponse, RequestStatus, RequestType } from "~/shared/types";

interface RoomService {
    create(data: RoomCreateDto): Promise<Room>;
    getById(roomId: number): Promise<Room>;
    getByUserId(userId: string, params?: RoomQueryParameters): Promise<PageResponse<RoomShort>>;
    fullUpdate(id: number, data: Room): Promise<Room>;
    patch(id: number, data: Partial<Room>): Promise<Room>;
    addMembers(id: number, userIds: string[]): Promise<Room>;
    deleteMembers(id: number, userIds: string[]): Promise<void>;
    leave(id: number): Promise<void>;
    delete(id: number): Promise<void>;

    addMembers(id: number, userIds: string[]): Promise<Room>;
    deleteMembers(id: number, userIds: string[]): Promise<void>;
    leave(id: number): Promise<void>;
    getAcceptedMembers(roomId: number | string): Promise<MemberShort[]>;
    getRequests(roomId: number | string, status: RequestStatus, type: RequestType): Promise<RoomMemberDto[]>;
    joinRoom(roomId: number | string): Promise<void>;
    inviteUser(roomId: number | string, receiverId: string): Promise<void>;
    acceptRequest(roomId: number | string, receiverId: string): Promise<void>;
    rejectRequest(roomId: number | string, receiverId: string): Promise<void>;

    pinRoom(roomId: number): Promise<RoomShort>;
    unpin(): Promise<void>;
}

export const roomService: RoomService = {
    async create(data) {
        const { data: response } = await apiClient.post(`/rooms`, data);
        return response;
    },

    async getById(roomId) {
        const { data } = await apiClient.get(`/rooms/${roomId}`);
        return data;
    },

    async getByUserId(userId, params) {
        const { data } = await apiClient.get(`/rooms/user/${userId}`, { params });
        return data;
    },

    async fullUpdate(id, data) {
        const { data: response } = await apiClient.put(`/rooms/${id}`, data);
        return response;
    },

    async patch(id, data) {
        const { data: response } = await apiClient.patch(`/rooms/${id}`, data);
        return response;
    },

    async delete(id) {
        await apiClient.delete(`/rooms/${id}`);
    },



    async addMembers(id, userIds) {
        const { data } = await apiClient.patch(`/rooms/${id}/members`, userIds);
        return data;
    },

    async deleteMembers(id, userIds) {
        await apiClient.delete(`/rooms/${id}/members`, { data: userIds });
    },

    async leave(id) {
        await apiClient.post(`/rooms/${id}/leave`);
    },

    async getAcceptedMembers(roomId) {
        const { data } = await apiClient.get(`/rooms/${roomId}/members`);
        return data;
    },

    async getRequests(roomId, status, type) {
        const { data } = await apiClient.get(`/rooms/${roomId}/members/requests`, {
            params: { status, type }
        });
        return data;
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

    
    async pinRoom(roomId) {
        const { data } = await apiClient.post<RoomShort>(`/rooms/${roomId}/pin`);
        return data;
    },

    async unpin() {
        await apiClient.post(`/rooms/unpin`);
    }
};