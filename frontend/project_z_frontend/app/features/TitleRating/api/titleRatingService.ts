import { titleRecordService,type TitleRecord } from "~/entities/titleRecord";
import { apiClient } from "~/shared/api";
import type { Rating } from "~/shared/types";
import type { SameCriteriaRating } from "../model/rating.types";


interface TitleRatingService {
    getSameCriteriaRating(titleId: number, category: string, currentRating: number): Promise<SameCriteriaRating>;
    rate(titleId: number, rating: Rating): Promise<TitleRecord>;
    clearRating(titleId: number): Promise<TitleRecord>;

}

export const titleRatingService: TitleRatingService = {
    async getSameCriteriaRating(titleId, category, currentRating) {
        const response = await apiClient.get(`/titles/${titleId}/getSameCriteriaRating`, {
            params: {
                category: category,
                currentRating: currentRating

            }
        });

        return response.data;
    },
    async rate(titleId: number, rating: Rating) {
        return titleRecordService.patch(titleId, { rating });
    },

    async clearRating(titleId: number) {
        return titleRecordService.patch(titleId, { rating: {} as Rating });
    },

};