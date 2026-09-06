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

export const useAddTitlesToPreset = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async ({
            presetId,
            titles,
        }: {
            presetId: string;
            titles: TitleRecord[];
        }) => {
            await WheelPresetService.addTitles(
                presetId,
                titles.map(({ titleId }) => ({ titleId })),
            );
        },
        onMutate: async ({ presetId, titles }) => {
            await queryClient.cancelQueries({ queryKey: wheelPresetKeys.all });

            const previousList = queryClient.getQueryData<Array<WheelPresetShort>>(wheelPresetKeys.all);
            const previousDetail = queryClient.getQueryData<WheelPreset<TitleRecord>>(
                wheelPresetKeys.detail(presetId),
            );
            const now = new Date().toISOString();

            let addedCount = 0;

            queryClient.setQueryData<WheelPreset<TitleRecord>>(
                wheelPresetKeys.detail(presetId),
                (old: WheelPreset<TitleRecord> | undefined) => {
                    if (!old) return old;

                    const existingIds = new Set(old.titles.map((config) => config.title.titleId));

                    const newTitles = titles
                        .filter((title) => !existingIds.has(title.titleId))
                        .map((title) => ({
                            title,
                            createdAt: now,
                        }));

                    addedCount = newTitles.length;

                    return {
                        ...old,
                        titles: [...old.titles, ...newTitles],
                        updatedAt: now,
                    };
                },
            );

            if (!previousDetail) {
                addedCount = titles.length;
            }

            queryClient.setQueryData<Array<WheelPresetShort>>(
                wheelPresetKeys.all,
                (old: Array<WheelPresetShort> | undefined) => {
                    if (!old) return old;
                    return old.map((preset) =>
                        preset.id === presetId
                            ? { ...preset, titlesCount: preset.titlesCount + addedCount }
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
            console.error("Failed to add titles to preset:", error);
            notify.error(getErrorMessage(error, "Failed to add titles to preset."));
        },
        onSettled: (_data, _error, variables) => {
            queryClient.invalidateQueries({ queryKey: wheelPresetKeys.all });
            if (variables?.presetId) {
                queryClient.invalidateQueries({ queryKey: wheelPresetKeys.detail(variables.presetId) });
            }
        },
    });

    return {
        addTitles: mutation.mutate,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
};
