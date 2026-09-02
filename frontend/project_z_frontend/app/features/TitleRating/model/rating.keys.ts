export const titleRatingKeys = {
    all: ['titleRating'] as const,
    sameCriteria: (titleId: number, category: string, ratingValue: number) =>
        [...titleRatingKeys.all, 'sameCriteria', titleId, category, ratingValue] as const,
    detail: (titleId: number) =>
        [...titleRatingKeys.all, "detail", titleId] as const,
};