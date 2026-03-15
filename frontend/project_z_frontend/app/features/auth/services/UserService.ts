import axios from "axios";
import type { RegisterData } from "~/features/auth/types/auth.types";
import type { CreateUserProfile, UserProfile } from "~/features/auth/types/user.types";
import { publicClient } from "../../../services/publicClient";
import { apiClient } from "../../../services/apiClient";

export const userService = {

    createUser: async (userData: CreateUserProfile): Promise<UserProfile> => {
        const response = await publicClient.post<UserProfile>("/users", userData);
        return response.data;
    },

    getUser: async (supabaseId: string): Promise<UserProfile> => {
        const response = await apiClient.get<UserProfile>(`/users/${supabaseId}`);
        return response.data;
    },

    isNameTagAvailable : async (nameTag: string): Promise<boolean> => {
        return (await publicClient.get<boolean>(`/users/${nameTag}/checkNameTag`)).data;
    }
};