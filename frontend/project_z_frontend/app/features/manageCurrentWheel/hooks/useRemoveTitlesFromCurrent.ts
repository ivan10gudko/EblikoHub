import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TitleRecord } from "~/entities/titleRecord";
import {
    WheelCurrentService,
    type WheelCurrent,
    wheelCurrentKeys,
} from "~/entities/wheel-current";
import { notify } from "~/shared/lib";
import { getErrorMessage } from "~/shared/utils/getErrorMessage";

export const useRemoveTitlesFromCurrent = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (titleIds: Array<number>) => {
            await WheelCurrentService.removeTitles(titleIds);
        },
        onMutate: async (titleIds) => {
            await queryClient.cancelQueries({ queryKey: wheelCurrentKeys.all });

            const previous = queryClient.getQueryData<WheelCurrent<TitleRecord>>(wheelCurrentKeys.all);
            const idsToRemove = new Set(titleIds);

            queryClient.setQueryData<WheelCurrent<TitleRecord>>(
                wheelCurrentKeys.all,
                (old: WheelCurrent<TitleRecord> | undefined) => {
                    if (!old) return old;

                    return {
                        ...old,
                        titles: old.titles.filter((config) => !idsToRemove.has(config.title.titleId)),
                        updatedAt: new Date().toISOString(),
                    };
                },
            );

            return { previous };
        },
        onError: (error, _variables, context) => {
            if (context?.previous) {
                queryClient.setQueryData(wheelCurrentKeys.all, context.previous);
            }
            console.error("Failed to remove titles from current wheel:", error);
            notify.error(getErrorMessage(error, "Failed to remove titles from current wheel."));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: wheelCurrentKeys.all });
        },
    });

    return {
        removeTitles: mutation.mutate,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
};
