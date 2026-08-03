import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WheelCurrentService } from "~/entities/wheel-current";
import { notify } from "~/shared/lib";
import { getErrorMessage } from "~/shared/utils/getErrorMessage";

export const useRemoveTitlesFromCurrent = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (titleIds: Array<number>) => {
            await WheelCurrentService.removeTitles(titleIds);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wheelCurrent"] });
        },
        onError: (error) => {
            console.error("Failed to remove titles from current wheel:", error);
            notify.error(getErrorMessage(error, "Failed to remove titles from current wheel."));
        }
    });

    return {
        removeTitles: mutation.mutate,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    }
}