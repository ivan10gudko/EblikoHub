import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TitleRecord } from "~/entities/titleRecord";
import {
    WheelPresetService,
    type UpdateWheelPresetSettings,
    type WheelPreset,
    type WheelPresetShort,
    wheelPresetKeys,
} from "~/entities/wheel-preset";
import { notify } from "~/shared/lib";
import { getErrorMessage } from "~/shared/utils/getErrorMessage";

type UpdatePresetSettingsVariables = UpdateWheelPresetSettings & { presetId: string };

export const useUpdatePresetSettings = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async ({ presetId: _presetId, ...settings }: UpdatePresetSettingsVariables) => {
            await WheelPresetService.updateSettings(settings);
        },
        onMutate: async ({ presetId, ...settings }) => {
            await queryClient.cancelQueries({ queryKey: wheelPresetKeys.all });

            const previousList = queryClient.getQueryData<Array<WheelPresetShort>>(wheelPresetKeys.all);
            const previousDetail = queryClient.getQueryData<WheelPreset<TitleRecord>>(
                wheelPresetKeys.detail(presetId),
            );
            const now = new Date().toISOString();

            queryClient.setQueryData<Array<WheelPresetShort>>(
                wheelPresetKeys.all,
                (old: Array<WheelPresetShort> | undefined) => {
                    if (!old) return old;
                    return old.map((preset) =>
                        preset.id === presetId
                            ? { ...preset, name: settings.name, mode: settings.mode }
                            : preset,
                    );
                },
            );

            queryClient.setQueryData<WheelPreset<TitleRecord>>(
                wheelPresetKeys.detail(presetId),
                (old: WheelPreset<TitleRecord> | undefined) => {
                    if (!old) return old;
                    return {
                        ...old,
                        name: settings.name,
                        mode: settings.mode,
                        spinDuration: settings.spinDuration,
                        updatedAt: now,
                    };
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
            console.error("Failed to update preset settings:", error);
            notify.error(getErrorMessage(error, "Failed to update preset settings."));
        },
        onSettled: (_data, _error, variables) => {
            queryClient.invalidateQueries({ queryKey: wheelPresetKeys.all });
            if (variables?.presetId) {
                queryClient.invalidateQueries({ queryKey: wheelPresetKeys.detail(variables.presetId) });
            }
        },
    });

    return {
        updateSettings: mutation.mutate,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
};
