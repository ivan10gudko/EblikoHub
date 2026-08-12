import type { UserShort } from "~/entities/room";

export interface RoomBanCreateDto {
    userId: string;
    reason: string;
}

export interface RoomBanDetailsDto {
    id: string;
    roomId: number;
    user: UserShort;
    reason: string;
    bannedByUser: UserShort;
    createdAt: string;
}
