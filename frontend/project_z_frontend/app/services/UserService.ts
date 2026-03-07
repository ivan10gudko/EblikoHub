import axios from "axios";
import type { RegisterData } from "~/types/auth.types";
import type { CreateUserProfile, UserProfile } from "~/types/user.types";
import { publicClient } from "./publicClient";

export const userService = {

    createUser: async (userData: RegisterData, supabaseId: string): Promise<UserProfile> => {
        const payload : CreateUserProfile = {
            userId: supabaseId,
            name: userData.name,
            nameTag: userData.username
        }
        const response = await publicClient.post<UserProfile>("/users", payload);
        return response.data;
    },

    getUser: async (supabaseId: string): Promise<UserProfile> => {
        const response = await publicClient.get<UserProfile>(`/users/${supabaseId}`);
        return response.data;
    },

    isNameTagAvailable : async (nameTag: string): Promise<boolean> => {
        return (await publicClient.get<boolean>(`/users/${nameTag}/checkNameTag`)).data;
    }
};