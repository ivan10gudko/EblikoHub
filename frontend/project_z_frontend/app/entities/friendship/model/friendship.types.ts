import type { UserProfile } from "~/entities/user";

export enum FriendshipStatus {
    PENDING= "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED"
}

export interface FriendshipDetailsDto {
    friendshipId: string; 
    sender: string;       
    receiver: string;     
    status: FriendshipStatus;
    createdAt: string;    
}

export interface FriendshipPartialUpdateDto {
    status?: FriendshipStatus;
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