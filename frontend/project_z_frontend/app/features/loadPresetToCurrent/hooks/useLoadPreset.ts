import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TitleRecord } from "~/entities/titleRecord";
import {
    WheelCurrentService,
    type WheelCurrent,
    wheelCurrentKeys,
} from "~/entities/wheel-current";
import { type WheelPreset, wheelPresetKeys } from "~/entities/wheel-preset";
import { notify } from "~/shared/lib";
import { getErrorMessage } from "~/shared/utils/getErrorMessage";

export const useLoadPreset = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (presetId: string) => {
            await WheelCurrentService.loadPreset(presetId);
        },
        onMutate: async (presetId) => {
            await queryClient.cancelQueries({ queryKey: wheelCurrentKeys.all });

            const previous = queryClient.getQueryData<WheelCurrent<TitleRecord>>(wheelCurrentKeys.all);
            const preset = queryClient.getQueryData<WheelPreset<TitleRecord>>(
                wheelPresetKeys.detail(presetId),
            );

            if (previous && preset) {
                queryClient.setQueryData<WheelCurrent<TitleRecord>>(wheelCurrentKeys.all, {
                    ...previous,
                    mode: preset.mode,
                    spinDuration: preset.spinDuration,
                    titles: preset.titles,
                    updatedAt: new Date().toISOString(),
                });
            }

            return { previous };
        },
        onError: (error, _variables, context) => {
            if (context?.previous) {
                queryClient.setQueryData(wheelCurrentKeys.all, context.previous);
            }
            console.error("Failed to load preset:", error);
            notify.error(getErrorMessage(error, "Failed to load preset."));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: wheelCurrentKeys.all });
        },
    });

    return {
        loadPreset: mutation.mutate,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
};
