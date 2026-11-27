import { apiClient } from "~/shared/api";
import type { UserProfileWithFavorite } from "~/features/profile/model/profile.types";

export const favoriteCharactersApi = {
    async addFavorite(characterId: string, position: number): Promise<UserProfileWithFavorite> {
        const response = await apiClient.post<UserProfileWithFavorite>(
            `/userFavoriteCharacters/${characterId}`,
            null,
            { params: { position } }
        );
        return response.data;
    },
    async deleteFavorite(favoriteId: string): Promise<void> {
        await apiClient.delete(`/userFavoriteCharacters/${favoriteId}`);
    },
};
