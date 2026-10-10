import type { WithFriendship } from "~/entities/friendship";
import { apiClient } from "~/shared/api";
import type { UserProfileWithFavorite } from "../model/profile.types";

export const profileService = {
    getUserProfile: async (supabaseId: string): Promise<WithFriendship<UserProfileWithFavorite>> => {
        const response = await apiClient.get<WithFriendship<UserProfileWithFavorite>>(`/users/${supabaseId}/profile`);
        return response.data;
    },
};