import type { PageResponse } from "~/shared/types";
import type { RoomTitleQueryParameters, RoomTitlesResponse, RoomTitleSummary, RoomTitleWithSearchQueryParams, RoomTitleWithUserLinks } from "../model/roomTitle.types";
import { apiClient } from "~/shared/api";


export interface RoomTitleService {
    getRoomTitles(roomId: number, params: RoomTitleQueryParameters): Promise<RoomTitlesResponse>;
    getRoomTitlesWithUserLinks(roomId:number, userId : string, params:RoomTitleWithSearchQueryParams) : Promise<PageResponse<RoomTitleWithUserLinks>>
}
export const roomTitleService: RoomTitleService = {
    async getRoomTitles(roomId, params) {
        const { data } = await apiClient.get(`rooms/${roomId}/titles/getRoomTitles`, {
            params: params
        });
        return data;
    },
    async getRoomTitlesWithUserLinks(roomId, userId, params){
        const{data} = await apiClient.get(`rooms/${roomId}/titles/getRoomTitlesWithUserLinks/${userId}`,{
            params: params
        })
        return data;
    }
}