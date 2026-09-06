import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TitleRecord } from "~/entities/titleRecord";
import type { WheelCurrent } from "~/entities/wheel-current";
import {
    WheelPresetService,
    type WheelPresetShort,
    wheelPresetKeys,
} from "~/entities/wheel-preset";
import { notify } from "~/shared/lib";
import { getErrorMessage } from "~/shared/utils/getErrorMessage";

const mapCurrentToPreset = (current: WheelCurrent<TitleRecord>, name: string) => {
    return {
        name,
        mode: current.mode,
        spinDuration: current.spinDuration,
        titles: current.titles.map((titleConfig) => ({
            titleId: titleConfig.title.titleId,
        })),
    };
};

export const useSaveCurrentToPreset = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async ({
            currentWheel,
            name,
        }: {
            currentWheel: WheelCurrent<TitleRecord>;
            name: string;
        }) => {
            const preset = mapCurrentToPreset(currentWheel, name);
            await WheelPresetService.create(preset);
        },
        onMutate: async ({ currentWheel, name }) => {
            await queryClient.cancelQueries({ queryKey: wheelPresetKeys.all });

            const previousList = queryClient.getQueryData<Array<WheelPresetShort>>(wheelPresetKeys.all);
            const now = new Date().toISOString();
            const optimisticPreset: WheelPresetShort = {
                id: `temp-preset-${Date.now()}`,
                name,
                mode: currentWheel.mode,
                titlesCount: currentWheel.titles.length,
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
            console.error("Failed to save current to preset:", error);
            notify.error(getErrorMessage(error, "Failed to save current to preset."));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: wheelPresetKeys.all });
        },
    });

    return {
        saveCurrentToPreset: (currentWheel: WheelCurrent<TitleRecord>, name: string) =>
            mutation.mutate({ currentWheel, name }),
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
};
