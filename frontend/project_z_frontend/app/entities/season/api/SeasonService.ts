import { apiClient } from "~/shared/api";
import type { CreateSeasonDto, DraftSeason, Season, UpdateSeasonDto } from "../model/season.types";



interface SeasonService {
    getAllByTitleId(titleId: number): Promise<Season[]>;

    create(titleId: number, data: CreateSeasonDto): Promise<Season>;

    fullUpdate(seasonId: number, data: Season): Promise<Season>;

    patch(seasonId: number, data: UpdateSeasonDto): Promise<Season>;
    sync(titleId: number, seasons: DraftSeason[]): Promise<Season[]>;
    delete(seasonId: number): Promise<void>;
}

export const seasonService: SeasonService = {
    async getAllByTitleId(titleId) {
        const response = await apiClient.get(`/seasons/${titleId}`);
        return response.data;
    },
    async sync(titleId,seasons) {
        const response = await apiClient.put(`/seasons/${titleId}/sync`, seasons);
        return response.data;
    },
    
    async create(titleId, data) {
        const response = await apiClient.post(`/seasons/${titleId}`, data);
        return response.data;
    },

    async fullUpdate(seasonId, data) {
        const response = await apiClient.put(`/seasons/${seasonId}`, data);
        return response.data;
    },

    async patch(seasonId, data) {
        const response = await apiClient.patch(`/seasons/${seasonId}`, data);
        return response.data;
    },

    async delete(seasonId) {
        await apiClient.delete(`/seasons/${seasonId}`);
    }
};