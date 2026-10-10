import type { QueryParams, RequestStatus } from "~/shared/types";
interface UserProfile {
    userId: string;
    name: string;
    nameTag: string;
    description?: string;
    img?: string | null;
    createdAt?: string;
}

export interface FriendshipDetailsDto {
    friendshipId: string;
    sender: string;
    receiver: string;
    status: RequestStatus;
    createdAt: string;
}

export interface FriendshipPartialUpdateDto {
    status?: RequestStatus;
}

export interface FriendRequestDto {
    friendshipId: string;
    user: UserProfile;
}

export interface FriendshipCounts {
    friendsCount: number;
    pendingCount: number;
    sentCount: number;
}

export interface FriendshipQueryParameters extends QueryParams { }

export type WithFriendship<T> = T & {
    friendshipStatus: RequestStatus | null;
    friendshipId?: string | null;
};