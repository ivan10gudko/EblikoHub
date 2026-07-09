import type { RoomTitleQueryParameters, RoomTitleWithSearchQueryParams } from "./roomTitle.types";

export const roomTitleKeys = {
    all: ['room-titles'] as const,
    list: (roomId: number, params: RoomTitleQueryParameters) =>
        [...roomTitleKeys.all, roomId, params] as const,
    withLinksBase: (roomId: number) =>
        ['room-titles-with-links', roomId] as const,
    withLinks: (roomId: number, userId: string) =>
        [...roomTitleKeys.withLinksBase(roomId), userId] as const,
    withLinksList: (roomId: number, userId: string, params: RoomTitleWithSearchQueryParams) =>
        [...roomTitleKeys.withLinks(roomId, userId), params] as const,
    userLinks: (roomId: number, roomTitleId: string) =>
        ['room-links', roomId, roomTitleId] as const,
    details: (roomId: number, roomTitleId: string) =>
        ['room-title-details', roomId, roomTitleId] as const,
};