import { apiClient, publicClient } from "~/shared/api";
import type { BadgeUser, CreateUserProfile, UpdateUserProfile, UserParams, UserProfile } from "../model/user.types";
import { generateFallbackName } from "../lib/generateFallbackName";
import type { PageResponse } from "~/shared/types";


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
    searchByNameTag: async (nameTag: string): Promise<UserProfile> => {
        const response = await apiClient.get<UserProfile>(`/users/${nameTag}/nameTag`);
        return response.data;
    },

    searchByName: async (name: string, params: UserParams = { page: 0, limit: 10 }): Promise<PageResponse<UserProfile>> => {
        const response = await apiClient.get<PageResponse<UserProfile>>(`/users/name/${name}`, {
            params: params 
        });
        
        return response.data;
    },
    
    getBadges: async (): Promise<BadgeUser[]> => {
        const response = await apiClient.get<BadgeUser[]>("/badges");
        return response.data;
    },
};