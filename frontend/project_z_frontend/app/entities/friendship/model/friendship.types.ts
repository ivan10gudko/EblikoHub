import type { UserProfile } from "~/entities/user";
import type { RequestStatus } from "~/shared/types";


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