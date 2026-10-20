export const SeasonsKeys = {
    all: ['seasons'] as const,
    detail: (seasonId?: number) =>
        [...SeasonsKeys.all, 'id', seasonId] as const,
};

export type TitlesQueryKey =

    | ReturnType<typeof SeasonsKeys.detail>;