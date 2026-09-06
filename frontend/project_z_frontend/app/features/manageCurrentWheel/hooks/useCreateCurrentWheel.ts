import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TitleRecord } from "~/entities/titleRecord";
import {
    WheelCurrentService,
    type WheelCurrent,
    wheelCurrentKeys,
} from "~/entities/wheel-current";
import type { WheelMode } from "~/shared/types";
import { notify } from "~/shared/lib";
import { getErrorMessage } from "~/shared/utils/getErrorMessage";

type CreateCurrentWheelInput = {
    mode: WheelMode;
    spinDuration: number;
    titles: TitleRecord[];
};

export const useCreateCurrentWheel = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (current: CreateCurrentWheelInput) => {
            await WheelCurrentService.create({
                mode: current.mode,
                spinDuration: current.spinDuration,
                titles: current.titles.map(({ titleId }) => ({ titleId })),
            });
        },
        onMutate: async (current) => {
            await queryClient.cancelQueries({ queryKey: wheelCurrentKeys.all });

            const previous = queryClient.getQueryData<WheelCurrent<TitleRecord>>(wheelCurrentKeys.all);
            const now = new Date().toISOString();

            queryClient.setQueryData<WheelCurrent<TitleRecord>>(wheelCurrentKeys.all, {
                userId: previous?.userId ?? "",
                mode: current.mode,
                spinDuration: current.spinDuration,
                updatedAt: now,
                titles: current.titles.map((title) => ({
                    title,
                    createdAt: now,
                })),
            });

            return { previous };
        },
        onError: (error, _variables, context) => {
            if (context?.previous !== undefined) {
                queryClient.setQueryData(wheelCurrentKeys.all, context.previous);
            }
            console.error("Failed to create current wheel:", error);
            notify.error(getErrorMessage(error, "Failed to create current wheel."));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: wheelCurrentKeys.all });
        },
    });

    return {
        createCurrentWheel: mutation.mutate,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
};
