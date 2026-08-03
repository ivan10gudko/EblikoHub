import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WheelCurrentService } from "~/entities/wheel-current";
import { notify } from "~/shared/lib";
import { getErrorMessage } from "~/shared/utils/getErrorMessage";

export const useAddTitlesToCurrent = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (titleIds: Array<{ titleId: number }>) => {
            await WheelCurrentService.addTitles(titleIds);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wheelCurrent"] });
        },
        onError: (error) => {
            console.error("Failed to add titles to current wheel:", error);
            notify.error(getErrorMessage(error, "Failed to add titles to current wheel."));
        }
    });

    return {
        addTitles: mutation.mutate,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    }
}