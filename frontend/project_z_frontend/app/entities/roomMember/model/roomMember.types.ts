import type { RequestStatus, RequestType } from "~/shared/types";



export interface MemberShortDto {
    id: string;
    username: string;
    avatarUrl?: string;
}

export interface RoomMemberDto {
    id: string;
    receiver: MemberShortDto;
    sender: MemberShortDto;
    status: RequestStatus;
    type: RequestType;
    createdAt: string;
}