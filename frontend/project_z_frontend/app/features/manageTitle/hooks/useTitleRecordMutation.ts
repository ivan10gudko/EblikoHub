import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Status, titleRecordService, type CreateTitleRecord, type TitleRating, type TitleRecord } from "~/entities/titleRecord";

export const useTitleRecordMutation = (apiTitleId: number | undefined, initialData: CreateTitleRecord,existingTitleRecord?: TitleRecord | null) => {
    const queryClient = useQueryClient();

    const queryKey = apiTitleId 
        ? ['titleRecord', apiTitleId] 
        : ['titleRecord', 'local', existingTitleRecord?.titleId];

    const mutationConfig = {
        onSuccess: (updatedRecord: TitleRecord | null) => {
            queryClient.setQueryData(queryKey, updatedRecord);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKey });
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
    });

    return {
        updateStatus: statusMutation.mutate,
        statusLoading: statusMutation.isPending,
        
        rate: rateMutation.mutate,
        rateLoading: rateMutation.isPending,

        clearRate: clearRateMutation.mutate,
        clearRateLoading: clearRateMutation.isPending,

        deleteTitle: deleteMutation.mutate,
        deleteLoading: deleteMutation.isPending,

        moveToPlanned: () => statusMutation.mutate(Status.PLANNED),
        markAsWatched: () => statusMutation.mutate(Status.WATCHED),
        
        isAnyActionLoading: statusMutation.isPending || rateMutation.isPending || deleteMutation.isPending
    };
};