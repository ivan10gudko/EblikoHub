import { apiClient, publicClient } from "~/shared/api";
import type { CreateUserProfile, UserProfile } from "../model/user.types";
import { generateFallbackName } from "../lib/generateFallbackName";


export const userService = {

    createUser: async (userData: CreateUserProfile): Promise<UserProfile> => {
        const response = await publicClient.post<UserProfile>("/users", userData);
        return response.data;
    },

    getUser: async (supabaseId: string): Promise<UserProfile> => {
        const response = await apiClient.get<UserProfile>(`/users/${supabaseId}`);
        return response.data;
    },

    createFallbackUser : async (userId: string): Promise<UserProfile> => {

        const altUserName = generateFallbackName()
        const userData = {
                            userId,
                            name: altUserName,
                            nameTag: altUserName
                        }
        const response = await publicClient.post<UserProfile>("/users", userData);
        return response.data;
    },

    isNameTagAvailable : async (nameTag: string): Promise<boolean> => {
        return (await publicClient.get<boolean>(`/users/${nameTag}/checkNameTag`)).data;
    }
};