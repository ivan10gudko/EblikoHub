import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "~/shared/lib";
import { getSessionUserId } from "~/shared/lib/supabase";
import type { Rating } from "~/shared/types";
import { getErrorMessage } from "~/shared/utils";
import { titleRatingService } from "../api/titleRatingService";
import { titleRatingKeys } from "../model/rating.keys";

export const useTitleRatingMutation = (titleId: number) => {
    const queryClient = useQueryClient();

    const queryKey =titleRatingKeys.detail(titleId);

    const mutationConfig = {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['titles'] });
            queryClient.invalidateQueries({ queryKey: ['titleRecord'] });
            queryClient.invalidateQueries({ queryKey: titleRatingKeys.all });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKey });
        },
        onError: (error: unknown) => {
            notify.error(getErrorMessage(error, "Something went wrong"));
        },
    };

    const rateMutation = useMutation({
        mutationFn: (rating: Rating) =>
            titleRatingService.rate(titleId, rating),
        ...mutationConfig
    });

    const clearRateMutation = useMutation({
        mutationFn: () =>
            titleRatingService.clearRating(titleId),
        ...mutationConfig
    });

    const checkAuthAndRun = async (action: () => void) => {
        const userId = await getSessionUserId();
        if (!userId) {
            notify.error("Please sign in first to perform this action");
            return;
        }
        action();
    };

    return {
        rate: (rating: Rating) => checkAuthAndRun(() => rateMutation.mutate(rating)),
        clearRate: () => checkAuthAndRun(() => clearRateMutation.mutate()),
        rateLoading: rateMutation.isPending,
        clearRateLoading: clearRateMutation.isPending,
        isRatingLoading: rateMutation.isPending || clearRateMutation.isPending,
    };
};