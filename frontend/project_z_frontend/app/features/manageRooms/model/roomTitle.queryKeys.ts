import type { RoomTitleQueryParameters, RoomTitleWithSearchQueryParams } from "./roomTitle.types";

export const roomTitleKeys = {
    all: ['room-titles'] as const,
    list: (roomId: number, params: RoomTitleQueryParameters) =>
        [...roomTitleKeys.all, roomId, params] as const,
    withLinks: (roomId: number, userId: string) =>
        ['room-titles-with-links', roomId, userId] as const,
    withLinksList: (roomId: number, userId: string, params: RoomTitleWithSearchQueryParams) =>
        [...roomTitleKeys.withLinks(roomId, userId), params] as const,
};