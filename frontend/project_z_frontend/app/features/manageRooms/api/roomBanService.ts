import { apiClient } from "~/shared/api";
import type { RoomBanCreateDto, RoomBanDetailsDto } from "../model/roomTitle.types";


export interface RoomBanService {
    findAllByRoom(roomId: number): Promise<RoomBanDetailsDto[]>;
    create(roomId: number, banDto: RoomBanCreateDto): Promise<RoomBanDetailsDto>;
    isBanned(roomId: number, userId: string): Promise<boolean>;
    unban(roomId: number, roomBanId: string): Promise<void>;
}

export const roomBanService: RoomBanService = {
    async findAllByRoom(roomId) {
        const { data } = await apiClient.get(`/rooms/${roomId}/bans`);
        return data;
    },

    async create(roomId, banDto) {
        const { data } = await apiClient.post(`/rooms/${roomId}/bans`, banDto);
        return data;
    },

    async isBanned(roomId, userId) {
        const { data } = await apiClient.get(`/rooms/${roomId}/bans/check/${userId}`);
        return data;
    },

    async unban(roomId, roomBanId) {
        await apiClient.delete(`/rooms/${roomId}/bans/${roomBanId}`);
    }
};