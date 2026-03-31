import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Status, titleRecordService, type CreateTitleRecord, type TitleRating, type TitleRecord } from "~/entities/titleRecord";

export const useTitleRecordMutation = (jikanId: number, initialData: CreateTitleRecord) => {
    const queryClient = useQueryClient();

    const mutationConfig = {
        onSuccess: (updatedRecord: TitleRecord | null) => {
            queryClient.setQueryData(['titleRecord', jikanId], updatedRecord);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['titleRecord', jikanId] });
        },
    };

    const getCache = () => queryClient.getQueryData<TitleRecord>(['titleRecord', jikanId]);

    const rateMutation = useMutation({
        mutationFn: (score: number | TitleRating) => 
            titleRecordService.rate({ jikanId, score, initialData, existingTitle: getCache() }),
        ...mutationConfig
    });

    const statusMutation = useMutation({
        mutationFn: (status: Status) => {
            const data = { status };
            return titleRecordService.saveAction({ jikanId, data, initialData, existingTitle: getCache() });
        },
        ...mutationConfig
    });

    const deleteMutation = useMutation({
        mutationFn: (titleId: number) => titleRecordService.delete(titleId),
        onSuccess: () => {
            queryClient.setQueryData(['titleRecord', jikanId], null);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['titleRecord', jikanId] });
        },
    });

    return {
        updateStatus: statusMutation.mutate,
        statusLoading: statusMutation.isPending,
        
        rate: rateMutation.mutate,
        rateLoading: rateMutation.isPending,

        deleteTitle: deleteMutation.mutate,
        deleteLoading: deleteMutation.isPending,

        moveToPlanned: () => statusMutation.mutate(Status.PLANNED),
        markAsWatched: () => statusMutation.mutate(Status.WATCHED),
        
        isAnyActionLoading: statusMutation.isPending || rateMutation.isPending || deleteMutation.isPending
    };
};