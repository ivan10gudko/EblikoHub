import { apiClient } from "~/shared/api";
import type { PageResponse } from "~/shared/types";
import type {
    FriendshipDetailsDto,
    FriendshipPartialUpdateDto,
    FriendRequestDto,
    FriendshipCounts,
    FriendshipQueryParameters,
    WithFriendship
} from "../model/friendship.types";

interface FriendshipService {
    sendFriendRequest(receiverId: string): Promise<void>;
    acceptFriendRequest(senderId: string): Promise<void>;
    rejectFriendRequest(senderId: string): Promise<void>;
    getFriendsByUserId(userId: string): Promise<FriendRequestDto[]>;
    getFriendshipById(id: string): Promise<FriendshipDetailsDto>;
    partialUpdate(id: string, data: FriendshipPartialUpdateDto): Promise<FriendshipDetailsDto>;
    getReceivedPendingRequests(userId: string): Promise<FriendRequestDto[]>;
    getSentPendingRequests(userId: string): Promise<FriendRequestDto[]>;
    deleteFriendshipById(id: string): Promise<void>;
    getFriendshipCounts(userId: string): Promise<FriendshipCounts>;
    searchUsersWithStatus<T>(
        name: string,
        params?: FriendshipQueryParameters
    ): Promise<PageResponse<WithFriendship<T>>>;
}

export const friendshipService: FriendshipService = {
    async sendFriendRequest(receiverId) {
        await apiClient.post(`/friendships/request/${receiverId}`);
    },

    async acceptFriendRequest(senderId) {
        await apiClient.put(`/friendships/accept/${senderId}`);
    },

    async rejectFriendRequest(senderId) {
        await apiClient.put(`/friendships/reject/${senderId}`);
    },

    async getFriendsByUserId(userId) {
        const response = await apiClient.get<FriendRequestDto[]>(`/friendships/user/${userId}`);
        return response.data;
    },

    async getFriendshipById(id) {
        const response = await apiClient.get<FriendshipDetailsDto>(`/friendships/${id}`);
        return response.data;
    },

    async partialUpdate(id, data) {
        const response = await apiClient.patch<FriendshipDetailsDto>(`/friendships/${id}`, data);
        return response.data;
    },

    async deleteFriendshipById(id) {
        await apiClient.delete(`/friendships/${id}`);
    },

    async getReceivedPendingRequests(userId) {
        const response = await apiClient.get<FriendRequestDto[]>(`/friendships/${userId}/receivedPending`);
        return response.data || [];
    },

    async getSentPendingRequests(userId) {
        const response = await apiClient.get<FriendRequestDto[]>(`/friendships/${userId}/sentPending`);
        return response.data || [];
    },

    async getFriendshipCounts(userId) {
        const response = await apiClient.get<FriendshipCounts>(`/friendships/${userId}/stats`);
        return response.data;
    },

    async searchUsersWithStatus<T>(name: string, params?: FriendshipQueryParameters) {
        const response = await apiClient.get<PageResponse<WithFriendship<T>>>(
            `/friendships/search/${name}`,
            { params }
        );
        return response.data;
    },
};