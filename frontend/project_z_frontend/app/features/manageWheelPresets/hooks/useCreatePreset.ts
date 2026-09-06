import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    WheelPresetService,
    type CreateWheelPreset,
    type WheelPresetShort,
    wheelPresetKeys,
} from "~/entities/wheel-preset";
import { notify } from "~/shared/lib";
import { getErrorMessage } from "~/shared/utils/getErrorMessage";

export const useCreatePreset = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (preset: CreateWheelPreset) => {
            await WheelPresetService.create(preset);
        },
        onMutate: async (preset) => {
            await queryClient.cancelQueries({ queryKey: wheelPresetKeys.all });

            const previousList = queryClient.getQueryData<Array<WheelPresetShort>>(wheelPresetKeys.all);
            const now = new Date().toISOString();
            const optimisticPreset: WheelPresetShort = {
                id: `temp-preset-${Date.now()}`,
                name: preset.name,
                mode: preset.mode,
                titlesCount: preset.titles.length,
                createdAt: now,
            };

            queryClient.setQueryData<Array<WheelPresetShort>>(
                wheelPresetKeys.all,
                (old: Array<WheelPresetShort> | undefined) => {
                    if (!old) return [optimisticPreset];
                    return [optimisticPreset, ...old];
                },
            );

            return { previousList };
        },
        onError: (error, _variables, context) => {
            if (context?.previousList) {
                queryClient.setQueryData(wheelPresetKeys.all, context.previousList);
            }
            console.error("Failed to create preset:", error);
            notify.error(getErrorMessage(error, "Failed to create preset."));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: wheelPresetKeys.all });
        },
    });

    return {
        createPreset: mutation.mutate,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
};
