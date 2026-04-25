import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Status, titleRecordService, type CreateTitleRecord, type TitleRating, type TitleRecord } from "~/entities/titleRecord";
import { getSessionUserId } from "~/shared/lib/supabase";
import type { PageResponse } from "~/shared/types";


export const useTitleRecordMutation = (apiTitleId: number | undefined, initialData: CreateTitleRecord, existingTitleRecord?: TitleRecord | null) => {
    const queryClient = useQueryClient();

    const queryKey = apiTitleId
        ? ['titleRecord', apiTitleId]
        : ['titleRecord', 'local', existingTitleRecord?.titleId];

    const mutationConfig = {
        onSuccess: (updatedRecord: TitleRecord | null) => {
            queryClient.setQueryData(queryKey, updatedRecord);
            if (updatedRecord) {
                queryClient.setQueriesData<InfiniteData<PageResponse<TitleRecord>>>(
                    { queryKey: ['titles'] },
                    (oldData) => {
                        if (!oldData) return oldData;

                        return {
                            ...oldData,
                            pages: oldData.pages.map((page) => ({
                                ...page,
                                content: page.content.map((item) =>
                                    item.titleId === updatedRecord.titleId ? updatedRecord : item
                                ),
                            })),
                        };
                    }
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKey });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Something went wrong";
            toast.error(message);
        },
    };

    const getCache = () => queryClient.getQueryData<TitleRecord>(queryKey) || existingTitleRecord;
    const rateMutation = useMutation({
        mutationFn: (score: number | TitleRating) =>
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
            queryClient.setQueryData(queryKey, null);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKey });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Something went wrong";
            toast.error(message);
        },
    });

    const checkAuthAndRun = async (action: () => void) => {
        const userId = await getSessionUserId();
        if (!userId) {
            toast.error("Please sign in first to perform this action")
            return;
        }
        action();
    };

    return {
        updateStatus: (status: Status) => checkAuthAndRun(() => statusMutation.mutate(status)),
        rate: (score: number | TitleRating) => checkAuthAndRun(() => rateMutation.mutate(score)),
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