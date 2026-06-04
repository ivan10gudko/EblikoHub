import type { QueryParams } from "~/shared/types";

export interface UserShort {
    userId: string;
    name: string;
    nameTag: string;
    createdAt: string;
}

export interface Room {
    roomId: number;
    roomName: string;
    owner: string; 
    members: UserShort[];
    createdAt: string;
}

export interface RoomCreateDto {
    roomName: string;
    members: string[]; 
}

export interface RoomShort {
    roomId: number;
    roomName: string;
    ownerId: string;
    usersCount: number;
}


export interface RoomQueryParameters extends QueryParams{
    search?:string;
}
