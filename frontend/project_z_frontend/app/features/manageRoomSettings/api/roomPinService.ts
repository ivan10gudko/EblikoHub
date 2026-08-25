import { apiClient } from "~/shared/api";
import type { RoomShort } from "~/entities/room";

interface RoomPinService {
    pinRoom(roomId: number): Promise<RoomShort>;
    unpin(): Promise<void>;
}

export const roomPinService: RoomPinService = {
    async pinRoom(roomId) {
        const { data } = await apiClient.post<RoomShort>(`/rooms/${roomId}/pin`);
        return data;
    },

    async unpin() {
        await apiClient.post(`/rooms/unpin`);
    },
};
