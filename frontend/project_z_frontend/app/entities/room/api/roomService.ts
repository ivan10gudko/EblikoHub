import { apiClient } from "~/shared/api";
import type { UserShort, Room, RoomCreateDto, RoomQueryParameters, RoomRequestCounts, RoomRequestShort, RoomSearchResult, RoomShort, UpdateRoomPayload, RequestsToRoomResponse, UserWithRelationsToRoomDto } from "../model/room.types";
import type { PageResponse, QueryParams, RequestStatus, RequestType } from "~/shared/types";
interface RoomService {
    create(data: RoomCreateDto): Promise<Room>;
    getById(roomId: number): Promise<Room>;
    getByUserId(userId: string, params?: QueryParams): Promise<PageResponse<RoomShort>>;
    fullUpdate(id: number, data: UpdateRoomPayload): Promise<Room>;
    patch(id: number, data: Partial<Room>): Promise<Room>;
    delete(id: number): Promise<void>;
    searchRoomByName(roomName: string, params?: RoomQueryParameters): Promise<PageResponse<RoomSearchResult>>;

    addMembers(id: number, userIds: string[]): Promise<Room>;
    deleteMembers(id: number, userIds: string[]): Promise<void>;
    leave(id: number): Promise<void>;
    getAcceptedMembers(roomId: number | string): Promise<UserShort[]>;
    getRequests(userId: string, status: RequestStatus, type: RequestType): Promise<RoomRequestShort[]>;
    getRoomRequests(roomId: number, status: string, type: string): Promise<RequestsToRoomResponse>;
    searchUsersForRoom(roomId: number, name: string, params: RoomQueryParameters): Promise<PageResponse<UserWithRelationsToRoomDto>>
    joinRoom(roomId: number | string): Promise<void>;
    inviteUser(roomId: number | string, receiverId: string): Promise<void>;
    acceptRequest(roomRequestId: string): Promise<void>;
    rejectRequest(roomRequestId: string): Promise<void>;
    cancelRequest(roomRequestId: string): Promise<void>;
    getRequestsCountsByUserId(userId: string): Promise<RoomRequestCounts>;
    pinRoom(roomId: number): Promise<RoomShort>;
    unpin(): Promise<void>;
    
    
    getRoomRequests(roomId: number, status: RequestStatus, type: RequestType): Promise<RequestsToRoomResponse>;
    searchUsersForRoom(roomId: number, name: string, params?: any): Promise<PageResponse<UserWithRelationsToRoomDto>>;
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
        const { data: response } = await apiClient.patch(`/rooms/${id}`, data);
        return response;
    },

    async patch(id, data) {
        const { data: response } = await apiClient.patch(`/rooms/${id}`, data);
        return response;
    },

    async delete(id) {
        await apiClient.delete(`/rooms/${id}`);
    },

    async searchRoomByName(roomName, params) {
        const { data } = await apiClient.get(`/rooms/roomSearch`, {
            params: { roomName, ...params }
        });
        return data;
    },

    async addMembers(id, userIds) {
        const { data } = await apiClient.patch(`/rooms/${id}/members`, userIds);
        return data;
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

    async getRequests(userId, status, type) {
        const { data } = await apiClient.get(`/rooms/requests`, {
            params: { userId, status, type }
        });
        return data;
    },
    async getRoomRequests(roomId, status, type) {
        const { data } = await apiClient.get(`/rooms/requests/${roomId}`, {
            params: { status, type }
        });
        return data;
    },
    async searchUsersForRoom(roomId, name, params) {
        const { data } = await apiClient.get(
            `/rooms/${roomId}/users/search`,
            {
                params: {
                    name, ...params
                }
            }
        );
        return data;
    },
    async joinRoom(roomId) {
        await apiClient.post(`/rooms/requests/join/${roomId}`);
    },

    async inviteUser(roomId, receiverId) {
        await apiClient.post(`/rooms/requests/invite`, {}, {
            params: { roomId, receiverId }
        });
    },

    async acceptRequest(roomRequestId) {
        await apiClient.put(`/rooms/requests/accept/${roomRequestId}`);
    },

    async rejectRequest(roomRequestId) {
        await apiClient.put(`/rooms/requests/reject/${roomRequestId}`);
    },

    async cancelRequest(roomRequestId) {
        await apiClient.delete(`/rooms/requests/cancelRequest/${roomRequestId}`);
    },

    async getRequestsCountsByUserId(userId) {
        const { data } = await apiClient.get(`/rooms/requests/requestCounts/user/${userId}`);
        return data;
    },

    async pinRoom(roomId) {
        const { data } = await apiClient.post<RoomShort>(`/rooms/${roomId}/pin`);
        return data;
    },

    async unpin() {
        await apiClient.post(`/rooms/unpin`);
    },


};