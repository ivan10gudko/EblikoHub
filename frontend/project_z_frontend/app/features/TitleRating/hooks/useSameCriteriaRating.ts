import { useQuery } from "@tanstack/react-query";
import { titleRatingKeys } from "../model/rating.keys";
import { titleRecordService } from "~/entities/titleRecord";

export const useSameCriteriaRating = (titleId: number, category: string, ratingValue: number) => {
    return useQuery({
        queryKey: titleRatingKeys.sameCriteria(titleId, category, ratingValue),
        queryFn: () => titleRecordService.getSameCriteriaRating(titleId, category, ratingValue),
        enabled: Boolean(titleId && category && ratingValue !== undefined),
    });
};