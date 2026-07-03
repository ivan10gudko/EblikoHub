import { apiClient } from "~/shared/api";
import type { PageResponse } from "~/shared/types";
import type { TitleType } from "~/entities/titleRecord";
import type { 
    RoomTitleQueryParameters, 
    RoomTitlesResponse, 
    RoomTitleWithSearchQueryParams, 
    RoomTitleWithUserLinks,
    RoomTitleDetails, 
    RoomTitleCreateRequest
} from "../model/roomTitle.types";



export interface RoomTitlesService {
    getRoomTitles(roomId: number, params: RoomTitleQueryParameters): Promise<RoomTitlesResponse>;
    getRoomTitlesWithUserLinks(roomId: number, userId: string, params: RoomTitleWithSearchQueryParams): Promise<PageResponse<RoomTitleWithUserLinks>>;
    createTitle(roomId: number, dto: RoomTitleCreateRequest): Promise<RoomTitleDetails>;
    deleteTitle(roomId: number, titleId: string): Promise<void>;
    findAll(roomId: number): Promise<RoomTitleDetails[]>;
}

export const roomTitleService: RoomTitlesService = {
    async getRoomTitles(roomId, params) {
        const { data } = await apiClient.get(`/rooms/${roomId}/titles/getRoomTitles`, { params });
        return data;
    },

    async getRoomTitlesWithUserLinks(roomId, userId, params) {
        const { data } = await apiClient.get(`/rooms/${roomId}/titles/getRoomTitlesWithUserLinks/${userId}`, { params });
        return data;
    },

    async createTitle(roomId, dto) {
        const { data } = await apiClient.post<RoomTitleDetails>(`/rooms/${roomId}/titles`, dto);
        return data;
    },

    async deleteTitle(roomId, titleId) {
        await apiClient.delete(`/rooms/${roomId}/titles/${titleId}`);
    },

    async findAll(roomId) {
        const { data } = await apiClient.get<RoomTitleDetails[]>(`/rooms/${roomId}/titles`);
        return data;
    }
};