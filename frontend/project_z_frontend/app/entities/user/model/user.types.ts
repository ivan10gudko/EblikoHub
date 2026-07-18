import type { QueryParams } from "~/shared/types";

export interface UserProfile {
    userId: string;
    name: string;
    nameTag: string;
    description?: string;
    img?: string;
    createdAt?: string;
}

export interface CreateUserProfile {
    userId: string;
    name: string;
    nameTag: string;
}

export interface UpdateUserProfile {
    name: string;
    description?: string;
}
export interface UserParams extends QueryParams {
   name?:string;
}
export interface UserShort {
    userId: string;
    name: string;
    nameTag: string;
    img?: string;
}
export interface BadgeUser {
    id: string;
    type: BadgeType;
    user: UserProfile;
}
export enum BadgeType {
    DEVELOPER = "DEVELOPER",
    RESPECTED = "RESPECTED"
}
export interface UserDtoWithRoomBanStatus{
    userId: string;
    name:string;
    nameTag:string;
    img?:string;
    isBanned:boolean;
    roomBanId:string;
}