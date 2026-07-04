import type { TitleParams } from "./titleRecord";

export const titleRecordKeys = {
    all: ['titles'] as const,
    list: (userId: string | null, params: TitleParams) =>
        [...titleRecordKeys.all, userId, params] as const,
    noLinksList: (userId: string | null, roomId: number, params: TitleParams) =>
        [...titleRecordKeys.all, 'noLinks', userId, roomId, params] as const,
};

export type TitlesQueryKey =
    | ReturnType<typeof titleRecordKeys.list>
    | ReturnType<typeof titleRecordKeys.noLinksList>;
