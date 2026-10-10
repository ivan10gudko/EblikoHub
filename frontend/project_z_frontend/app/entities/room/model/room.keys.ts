import type { QueryParams } from "~/shared/types";

export const roomKeys = {
    all: ['rooms'] as const,
    userSearch: (roomId: number | null, name: string, params: QueryParams) =>
        ['room_users_search', roomId, name, params] as const,
    details: (roomId: number) => ['room', roomId] as const,
};