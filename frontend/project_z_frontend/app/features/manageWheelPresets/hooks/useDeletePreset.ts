import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TitleRecord } from "~/entities/titleRecord";
import {
    WheelPresetService,
    type WheelPreset,
    type WheelPresetShort,
    wheelPresetKeys,
} from "~/entities/wheel-preset";
import { notify } from "~/shared/lib";
import { getErrorMessage } from "~/shared/utils/getErrorMessage";

export const useDeletePreset = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (presetId: string) => {
            await WheelPresetService.delete(presetId);
        },
        onMutate: async (presetId) => {
            await queryClient.cancelQueries({ queryKey: wheelPresetKeys.all });

            const previousList = queryClient.getQueryData<Array<WheelPresetShort>>(wheelPresetKeys.all);
            const previousDetail = queryClient.getQueryData<WheelPreset<TitleRecord>>(
                wheelPresetKeys.detail(presetId),
            );

            queryClient.setQueryData<Array<WheelPresetShort>>(
                wheelPresetKeys.all,
                (old: Array<WheelPresetShort> | undefined) => {
                    if (!old) return old;
                    return old.filter((preset) => preset.id !== presetId);
                },
            );

            queryClient.removeQueries({ queryKey: wheelPresetKeys.detail(presetId) });

            return { previousList, previousDetail, presetId };
        },
        onError: (error, _variables, context) => {
            if (context?.previousList) {
                queryClient.setQueryData(wheelPresetKeys.all, context.previousList);
            }
            if (context?.previousDetail && context.presetId) {
                queryClient.setQueryData(
                    wheelPresetKeys.detail(context.presetId),
                    context.previousDetail,
                );
            }
            console.error("Failed to delete preset:", error);
            notify.error(getErrorMessage(error, "Failed to delete preset."));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: wheelPresetKeys.all });
        },
    });

    return {
        deletePreset: mutation.mutate,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
};
