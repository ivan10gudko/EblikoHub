import { apiClient } from "~/shared/api";
import type { PageResponse } from "~/shared/types";
import type {
    RoomTitleQueryParameters,
    RoomTitlesResponse,
    RoomTitleWithSearchQueryParams,
    RoomTitleWithUserLinks,
    RoomTitleDetails,
    RoomTitleCreateRequest,
    RoomTitleLinkCreate,
    RoomTitleLinkDetails
} from "../model/roomTitle.types";

export interface RoomTitlesService {
    getRoomTitles(roomId: number, params: RoomTitleQueryParameters): Promise<RoomTitlesResponse>;
    getRoomTitlesWithUserLinks(roomId: number, userId: string, params: RoomTitleWithSearchQueryParams): Promise<PageResponse<RoomTitleWithUserLinks>>;
    createTitle(roomId: number, dto: RoomTitleCreateRequest): Promise<RoomTitleDetails>;
    updateTitle(roomId: number, titleId: string, dto: RoomTitleCreateRequest): Promise<RoomTitleDetails>;
    deleteTitle(roomId: number, titleId: string): Promise<void>;
    findAll(roomId: number): Promise<RoomTitleDetails[]>;


    //links
    createRoomTitleLink(roomId: number, dto: RoomTitleLinkCreate): Promise<RoomTitleLinkDetails>;
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

    async updateTitle(roomId, titleId, dto) {
        const { data } = await apiClient.put<RoomTitleDetails>(`/rooms/${roomId}/titles/${titleId}`, dto);
        return data;
    },

    async deleteTitle(roomId, titleId) {
        await apiClient.delete(`/rooms/${roomId}/titles/${titleId}`);
    },

    async findAll(roomId) {
        const { data } = await apiClient.get<RoomTitleDetails[]>(`/rooms/${roomId}/titles`);
        return data;
    },


    //links

    async createRoomTitleLink(roomId, dto) {
        const { data } = await apiClient.post(`/rooms/${roomId}/links`, dto);
        return data;
    },
};