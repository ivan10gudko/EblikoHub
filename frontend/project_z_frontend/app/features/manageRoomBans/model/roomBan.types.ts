import type { RoomParticipantDto } from "~/entities/room";

export interface RoomBanCreateDto {
    userId: string;
    reason: string;
}

export interface RoomBanDetailsDto {
    id: string;
    roomId: number;
    user: RoomParticipantDto;
    reason: string;
    bannedByUser: RoomParticipantDto;
    createdAt: string;
}
