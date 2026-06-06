import { apiClient } from "~/shared/api";
import type { Room, RoomCreateDto, RoomQueryParameters, RoomShort } from "../model/room.types";
import type { PageResponse } from "~/shared/types";

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

    async delete(id) {
        await apiClient.delete(`/rooms/${id}`);
    }
};