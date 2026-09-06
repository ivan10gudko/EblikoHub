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

export const useRemoveTitlesFromPreset = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async ({
            presetId,
            titleIds,
        }: {
            presetId: string;
            titleIds: Array<number>;
        }) => {
            await WheelPresetService.removeTitles(presetId, titleIds);
        },
        onMutate: async ({ presetId, titleIds }) => {
            await queryClient.cancelQueries({ queryKey: wheelPresetKeys.all });

            const previousList = queryClient.getQueryData<Array<WheelPresetShort>>(wheelPresetKeys.all);
            const previousDetail = queryClient.getQueryData<WheelPreset<TitleRecord>>(
                wheelPresetKeys.detail(presetId),
            );
            const idsToRemove = new Set(titleIds);
            const now = new Date().toISOString();

            let removedCount = titleIds.length;

            queryClient.setQueryData<WheelPreset<TitleRecord>>(
                wheelPresetKeys.detail(presetId),
                (old: WheelPreset<TitleRecord> | undefined) => {
                    if (!old) return old;

                    const nextTitles = old.titles.filter(
                        (config) => !idsToRemove.has(config.title.titleId),
                    );
                    removedCount = old.titles.length - nextTitles.length;

                    return {
                        ...old,
                        titles: nextTitles,
                        updatedAt: now,
                    };
                },
            );

            queryClient.setQueryData<Array<WheelPresetShort>>(
                wheelPresetKeys.all,
                (old: Array<WheelPresetShort> | undefined) => {
                    if (!old) return old;
                    return old.map((preset) =>
                        preset.id === presetId
                            ? {
                                  ...preset,
                                  titlesCount: Math.max(0, preset.titlesCount - removedCount),
                              }
                            : preset,
                    );
                },
            );

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
            console.error("Failed to remove titles from preset:", error);
            notify.error(getErrorMessage(error, "Failed to remove titles from preset."));
        },
        onSettled: (_data, _error, variables) => {
            queryClient.invalidateQueries({ queryKey: wheelPresetKeys.all });
            if (variables?.presetId) {
                queryClient.invalidateQueries({ queryKey: wheelPresetKeys.detail(variables.presetId) });
            }
        },
    });

    return {
        removeTitles: mutation.mutate,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
};
