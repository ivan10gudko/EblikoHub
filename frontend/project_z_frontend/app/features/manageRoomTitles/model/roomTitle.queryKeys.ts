import type { RoomTitleQueryParameters, RoomTitleWithSearchQueryParams } from "./roomTitle.types";

export const roomTitleKeys = {
    all: ['room-titles'] as const,

    room: (roomId: number) => [...roomTitleKeys.all, roomId] as const,

    lists: (roomId: number) => [...roomTitleKeys.room(roomId), 'lists'] as const,
    list: (roomId: number, params: RoomTitleQueryParameters) =>
        [...roomTitleKeys.lists(roomId), params] as const,
    listNoPaged: (roomId: number) =>
        [...roomTitleKeys.lists(roomId), 'no-paged'] as const,

    suggestions: (roomId: number) => [...roomTitleKeys.room(roomId), 'suggestions'] as const,
    suggestedToAdd: (roomId: number, userId: string) =>
        [...roomTitleKeys.suggestions(roomId), userId] as const,

    withLinksBases: (roomId: number) => [...roomTitleKeys.room(roomId), 'with-links'] as const,
    withLinksBase: (roomId: number) =>
        [...roomTitleKeys.withLinksBases(roomId), 'base'] as const,
    withLinks: (roomId: number, userId: string) =>
        [...roomTitleKeys.withLinksBases(roomId), userId] as const,
    withLinksList: (roomId: number, userId: string, params: RoomTitleWithSearchQueryParams) =>
        [...roomTitleKeys.withLinks(roomId, userId), params] as const,

    userLinks: (roomId: number, roomTitleId: string) =>
        [...roomTitleKeys.room(roomId), 'room-links', roomTitleId] as const,

    detailsRoot: (roomId: number) => [...roomTitleKeys.room(roomId), 'details'] as const,
    details: (roomId: number, roomTitleId: string) =>
        [...roomTitleKeys.detailsRoot(roomId), roomTitleId] as const,
    detailsWithLinks: (roomId: number, roomTitleId: string) =>
        [...roomTitleKeys.details(roomId, roomTitleId), 'withLinks'] as const,
};