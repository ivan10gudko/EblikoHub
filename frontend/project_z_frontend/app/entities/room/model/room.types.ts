import type { InfiniteQueryPageParamsOptions } from "@tanstack/react-query";
import type { QueryParams, RequestStatus, RequestType, Status } from "~/shared/types";

export interface UserShort {
    userId: string;
    name: string;
    nameTag: string;
    imageUrl?: string;
}
export interface Room {
    roomId: number;
    roomName: string;
    owner: string;
    members: RoomMemberShort[];
    imageUrl?: string;
    description?: string;
    createdAt: string; 
}
export interface UpdateRoomPayload {
    roomName: string;
    imageUrl: string;
    description: string;
}

export enum RoomDetailsSortVariants {
    titleName = "titleName",
    avgRating = "avgRating",
    createdAt = "createdAt",
}

export const roomSortOptions = [
    { label: "Name", value: RoomDetailsSortVariants.titleName },
    { label: "Average room rating", value: RoomDetailsSortVariants.avgRating },
    { label: "Room title date added", value: RoomDetailsSortVariants.createdAt },
];

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

export interface RoomRequestShort {
    id: string;
    room: RoomShort;
    userId: string;
    sender: UserShort;
    status: RequestStatus;
    type: RequestType;
    createdAt: string;
}
export interface RoomRequestShortWithUser{
    id:string;
    user:UserShort
    sender:UserShort;
    status:RequestStatus;
    type:RequestType;
    createdAt:string;
}
export interface RequestsToRoomResponse{
    roomId:number;
    requests:RoomRequestShortWithUser[];
}
export interface RoomRequestCounts {
    incomingCount: number;
    outgoingCount: number;
}

export interface RoomMemberShort {
    id: string;
    user: UserShort;
    role: RoomRole;
    createdAt: string;
}
export interface RoomMember{
    id:string
    user:UserShort;
    role:RoomRole
    createdAt:string;
}

export enum RoomRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
}