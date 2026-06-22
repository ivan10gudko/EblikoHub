import { apiClient } from "~/shared/api";
import type { FriendshipDetailsDto, FriendshipPartialUpdateDto, FriendRequestDto, FriendshipCounts, UserDtoWithFriendshipStatus, FriendshipQueryParameters } from "../model/friendship.types";
import type { PageResponse } from "~/shared/types";

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
    searchUsersWithStatus(
        name: string,
        params?: FriendshipQueryParameters
    ): Promise<PageResponse<UserDtoWithFriendshipStatus>>;
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
        const response = await apiClient.get(`/friendships/user/${userId}`);
        return response.data;
    },

    async getFriendshipById(id) {
        const response = await apiClient.get(`/friendships/${id}`);
        return response.data;
    },

    async partialUpdate(id, data) {
        const response = await apiClient.patch(`/friendships/${id}`, data);
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
    async searchUsersWithStatus(name, params) {
        const response = await apiClient.get<PageResponse<UserDtoWithFriendshipStatus>>(
            `/friendships/search/${name}`,
            { params }
        );
        return response.data;
    },
};