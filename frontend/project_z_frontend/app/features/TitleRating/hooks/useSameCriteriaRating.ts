import { useQuery } from "@tanstack/react-query";
import { titleRatingService } from "../api/titleRatingService";
import { titleRatingKeys } from "../model/rating.keys";

export const useSameCriteriaRating = (titleId: number, category: string, ratingValue: number) => {
    return useQuery({
        queryKey: titleRatingKeys.sameCriteria(titleId, category, ratingValue),
        queryFn: () => titleRatingService.getSameCriteriaRating(titleId, category, ratingValue),
        enabled: Boolean(titleId && category && ratingValue !== undefined),
    });
};