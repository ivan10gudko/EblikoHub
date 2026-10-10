
import { apiClient } from "~/shared/api";
import type { UserProfileWithFavorite } from "../../profile/model/profile.types";
import type { Title } from "~/entities/title/model/animeTitle.types";

export const favoriteTitlesApi = {
    async addFavorite(titleId: number, position: number): Promise<Title> {
        const response = await apiClient.post<Title>(
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
    getUserProfile: async (userId: string): Promise<UserProfileWithFavorite> => {
        const response = await apiClient.get<UserProfileWithFavorite>(`/users/${userId}/profile`);
        return response.data;
    },
};