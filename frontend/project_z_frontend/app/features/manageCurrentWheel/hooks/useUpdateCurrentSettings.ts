import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TitleRecord } from "~/entities/titleRecord";
import {
    WheelCurrentService,
    type UpdateWheelCurrentSettings,
    type WheelCurrent,
    wheelCurrentKeys,
} from "~/entities/wheel-current";
import { notify } from "~/shared/lib";
import { getErrorMessage } from "~/shared/utils/getErrorMessage";

export const useUpdateCurrentSettings = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (settings: UpdateWheelCurrentSettings) => {
            await WheelCurrentService.updateSettings(settings);
        },
        onMutate: async (settings) => {
            await queryClient.cancelQueries({ queryKey: wheelCurrentKeys.all });

            const previous = queryClient.getQueryData<WheelCurrent<TitleRecord>>(wheelCurrentKeys.all);

            queryClient.setQueryData<WheelCurrent<TitleRecord>>(
                wheelCurrentKeys.all,
                (old: WheelCurrent<TitleRecord> | undefined) => {
                    if (!old) return old;
                    return {
                        ...old,
                        mode: settings.mode,
                        spinDuration: settings.spinDuration,
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
            console.error("Failed to update current wheel settings:", error);
            notify.error(getErrorMessage(error, "Failed to update current wheel settings."));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: wheelCurrentKeys.all });
        },
    });

    return {
        updateSettings: mutation.mutate,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
};
