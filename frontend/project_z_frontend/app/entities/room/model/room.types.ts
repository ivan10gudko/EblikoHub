
import type { QueryParams, RequestStatus, RequestType } from "~/shared/types";

export interface MemberShort {
    userId: string;
    name: string;
    nameTag: string;
    imageUrl?: string;
}

export interface Room {
    roomId: number;
    roomName: string;
    owner: string;
    members: MemberShort[];
    createdAt: string;
}

export interface RoomCreateDto {
    roomName: string;
    imageUrl: string | null;
    members: string[];
}

export interface RoomShort {
    roomId: number;
    roomName: string;
    imageUrl: string;
    isPinned: boolean;
    isOwner: boolean;
    usersCount: number;
}

export interface RoomSearchResult {
    roomId: number;
    roomName: string;
    imageUrl: string;
    isMember: boolean;
    isRequested: boolean;
    memberCount: number;
}

export interface RoomQueryParameters extends QueryParams {
    search?: string;
}


export interface RoomMemberDto {
    id: string;
    receiver: MemberShort;
    sender: MemberShort;
    status: RequestStatus;
    type: RequestType;
    createdAt: string;
}


export interface RoomRequestShort{
    id : string;
    room : RoomShort;
    userId : string;
    sender : MemberShort;
    status: RequestStatus;
    type : RequestType;
    createdAt : string;

}
export interface RoomRequestCounts{
    incomingCount: number;
    outgoingCount: number;
}