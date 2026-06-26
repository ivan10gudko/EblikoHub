
import type { QueryParams, RequestStatus } from "~/shared/types";

export interface UserProfile {
    userId: string;
    name: string;
    nameTag: string;
    description?: string;
    img?: string;
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

export interface UserDtoWithFriendshipStatus {
    userId: string;
    name: string;
    nameTag: string;
    img: string | null;
    friendshipStatus: RequestStatus;
    friendshipId: string | null;
}
export interface FriendshipQueryParameters extends QueryParams{

}