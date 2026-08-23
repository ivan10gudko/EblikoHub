import { apiClient } from "~/shared/api";
import type { Room, RoomCreateDto, RoomQueryParameters, RoomRequestCounts, RoomRequestShort, RoomSearchResult, RoomShort, UpdateRoomPayload, UserWithRelationsToRoomDto, RequestsToRoomResponse } from "../model/room.types";
import type { PageResponse } from "~/shared/types";



interface RoomService {
    create(data: RoomCreateDto): Promise<Room>;
    getById(roomId: number): Promise<Room>;
    getByUserId(userId: string, params?: RoomQueryParameters): Promise<PageResponse<RoomShort>>;
    partialUpdate(id: number, data: UpdateRoomPayload): Promise<Room>;
    patch(id: number, data: Partial<Room>): Promise<Room>;
    delete(id: number): Promise<void>;
    searchRoomByName(roomName: string, params?: RoomQueryParameters): Promise<PageResponse<RoomSearchResult>>;
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

    async partialUpdate(id, data) {
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

};