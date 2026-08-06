
import { apiClient } from "~/shared/api";
import type { UserProfileDto } from "../model/favorite.types";

export const favoriteTitlesApi = {
    async addOrUpdateFavorite(titleId: number, position: number): Promise<UserProfileDto> {
        const response = await apiClient.post<UserProfileDto>(
            `/userFavoriteTitles/${titleId}`,
            null,
            {
                params: { position },
            }
        );
        return response.data;
    },
    async deleteFavorite(favoriteId: string): Promise<void> {
        await apiClient.delete(`/userFavoriteTitles/${favoriteId}`);
    },
    getUserProfile: async (userId: string): Promise<UserProfileDto> => {
            const response = await apiClient.get<UserProfileDto>(`/users/${userId}/profile`);
            return response.data;
        },
};