import type { PageResponse } from "~/shared/types";
import type { RoomTitleQueryParameters, RoomTitlesResponse, RoomTitleSummary } from "../model/roomTitleSummary.types";
import { apiClient } from "~/shared/api";


export interface RoomTitleService {
    getRoomTitles(roomId: number, params: RoomTitleQueryParameters): Promise<RoomTitlesResponse>;
}
export const roomTitleService: RoomTitleService = {
    async getRoomTitles(roomId, params) {
        const { data } = await apiClient.get(`rooms/${roomId}/titles/getRoomTitles`, {
            params: params
        });
        return data;
    },
}