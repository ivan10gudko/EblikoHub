import { apiClient, publicClient } from "~/shared/api";
import type { CreateUserProfile, UpdateUserProfile, UserProfile } from "../model/user.types";


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
    },

    updateUser: async( userId:string,userData : UpdateUserProfile) : Promise<UpdateUserProfile> => {
        return (await apiClient.put<UserProfile>(`users/${userId}`, userData)).data;
    },

    uploadAvatar:async(userId:string, avatarFile:File): Promise<void> => {
        const formData = new FormData();
        formData.append('file', avatarFile);
        await apiClient.put(`/users/avatar/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            });
        
    },
};