import type { RequestsToRoomResponse, UserWithRelationsToRoomDto } from "~/entities/room";
import type { UserParams } from "~/entities/user/model/user.types";
import { apiClient } from "~/shared/api";
import type { PageResponse, RequestStatus, RequestType } from "~/shared/types";

interface RoomRequestsService {

    getRoomRequests(roomId: number, status: RequestStatus, type: RequestType): Promise<RequestsToRoomResponse>;
    searchUsersForRoom(roomId: number, name: string, params?: UserParams): Promise<PageResponse<UserWithRelationsToRoomDto>>;
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
    }
};