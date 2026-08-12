import type { RequestsToRoomResponse, UserWithRelationsToRoomDto, RoomRequestShort, RoomRequestCounts } from "~/entities/room";
import type { UserParams } from "~/entities/user/model/user.types";
import { apiClient } from "~/shared/api";
import type { PageResponse, RequestStatus, RequestType } from "~/shared/types";

interface RoomRequestsService {

    getRoomRequests(roomId: number, status: RequestStatus, type: RequestType): Promise<RequestsToRoomResponse>;
    searchUsersForRoom(roomId: number, name: string, params?: UserParams): Promise<PageResponse<UserWithRelationsToRoomDto>>;
    getRequests(userId: string, status: RequestStatus, type: RequestType): Promise<RoomRequestShort[]>;
    joinRoom(roomId: number | string): Promise<void>;
    inviteUser(roomId: number | string, receiverId: string): Promise<void>;
    acceptRequest(roomRequestId: string): Promise<void>;
    rejectRequest(roomRequestId: string): Promise<void>;
    cancelRequest(roomRequestId: string): Promise<void>;
    getRequestsCountsByUserId(userId: string): Promise<RoomRequestCounts>;
}


export const roomRequestsService: RoomRequestsService = {


    async getRoomRequests(roomId, status, type) {
        const { data } = await apiClient.get(`/rooms/requests/${roomId}`, {
            params: { status, type }
        });
        return data;
    },

    async searchUsersForRoom(roomId, name, params) {
        const { data } = await apiClient.get(`/rooms/${roomId}/members/users/search`, {
            params: { name, ...params }
        });
        return data;
    },

    async getRequests(userId, status, type) {
        const { data } = await apiClient.get(`/rooms/requests`, {
            params: { userId, status, type }
        });
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
    }
};