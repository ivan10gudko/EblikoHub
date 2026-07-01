import { useMutation, useQueryClient } from "@tanstack/react-query";
import { titleRecordService, type CreateTitleRecord, type TitleRecord } from "~/entities/titleRecord";
import { notify } from "~/shared/lib";
import { getSessionUserId } from "~/shared/lib/supabase";
import type { Rating } from "~/shared/types";
import { Status } from "~/shared/types";

export const useTitleRecordMutation = (apiTitleId: number | undefined, initialData: CreateTitleRecord, existingTitleRecord?: TitleRecord | null) => {
    const queryClient = useQueryClient();

    const queryKey = apiTitleId
        ? ['titleRecord', apiTitleId]
        : ['titleRecord', 'local', existingTitleRecord?.titleId];

    const mutationConfig = {
        onSuccess: (_updatedRecord: TitleRecord | null) => {
            
            queryClient.invalidateQueries({ queryKey: ['titles'] });
            queryClient.invalidateQueries({ queryKey: ['titleRecord'] });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKey });
        },
        onError: (error: any) => {
            console.error("Помилка зміни статусу/оцінки:", error);
            const message = error.response?.data?.message || "Something went wrong";
            notify.error(message);
        },
    };

    const getCache = () => queryClient.getQueryData<TitleRecord>(queryKey) || existingTitleRecord;

    const rateMutation = useMutation({
        mutationFn: (score: number | Rating) =>
            titleRecordService.rate({ apiTitleId, score, initialData, existingTitle: getCache() }),
        ...mutationConfig
    });

    const clearRateMutation = useMutation({
        mutationFn: () =>
            titleRecordService.clearRating({ apiTitleId, initialData, existingTitle: getCache() }),
        ...mutationConfig
    });

    const statusMutation = useMutation({
        mutationFn: (status: Status) => {
            const data = { status };
            return titleRecordService.saveAction({ apiTitleId, data, initialData, existingTitle: getCache() });
        },
        ...mutationConfig
    });

    const deleteMutation = useMutation({
        mutationFn: (titleId: number) => titleRecordService.delete(titleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['titles'] });
            queryClient.invalidateQueries({ queryKey: ['titleRecord'] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Something went wrong";
            notify.error(message);
        },
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
        updateStatus: (status: Status) => checkAuthAndRun(() => statusMutation.mutate(status)),
        rate: (score: number | Rating) => checkAuthAndRun(() => rateMutation.mutate(score)),
        clearRate: () => checkAuthAndRun(() => clearRateMutation.mutate()),
        deleteTitle: (titleId: number) => checkAuthAndRun(() => deleteMutation.mutate(titleId)),
        moveToPlanned: () => checkAuthAndRun(() => statusMutation.mutate(Status.PLANNED)),
        markAsWatched: () => checkAuthAndRun(() => statusMutation.mutate(Status.WATCHED)),

        statusLoading: statusMutation.isPending,
        rateLoading: rateMutation.isPending,
        clearRateLoading: clearRateMutation.isPending,
        deleteLoading: deleteMutation.isPending,
        isAnyActionLoading: statusMutation.isPending || rateMutation.isPending || deleteMutation.isPending
    };
};