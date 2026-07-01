import { useMutation, useQueryClient } from "@tanstack/react-query";
import { titleRecordService, type TitleRecord } from "~/entities/titleRecord";
import { notify } from "~/shared/lib";
import { getErrorMessage } from "~/shared/utils";

const notifyMutationError = (error: unknown, fallback: string) => {
  notify.error(getErrorMessage(error, fallback));
};

export const useUpdateTitleRecord = (titleId: number) => {
  const queryClient = useQueryClient();

  const refreshAllCaches = () => {
    queryClient.invalidateQueries({ queryKey: ['titles'] });
    queryClient.invalidateQueries({ queryKey: ['titleRecord'] });
  };

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<TitleRecord>) => titleRecordService.patch(titleId, updates),
    onSuccess: () => {
      refreshAllCaches();
    },
    onError: (error: unknown) => {
      notifyMutationError(error, "Failed to save changes");
    },
  });

  const pinMutation = useMutation({
    mutationFn: () => titleRecordService.pinTitle(titleId),
    onSuccess: () => {
      refreshAllCaches();
      notify.success("Pinned to top!");
    },
    onError: (error: unknown) => {
      console.error(error);
      notifyMutationError(error, "Error while pinning");
    },
  });

  const unpinMutation = useMutation({
    mutationFn: () => titleRecordService.unpin(),
    onSuccess: () => {
      refreshAllCaches();
      notify.success("Unpinned!");
    },
    onError: (error: unknown) => {
      notifyMutationError(error, "Error while unpinning");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => titleRecordService.delete(titleId),
    onSuccess: () => {
      refreshAllCaches();
    },
    onError: (error: unknown) => {
      notifyMutationError(error, "Failed to delete title");
    },
  });

  return {
    updateTitle: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteTitle: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    pinTitle: pinMutation.mutate,
    isPinning: pinMutation.isPending,
    unpinTitle: () => unpinMutation.mutate(),
    isUnpinning: unpinMutation.isPending,
  };
};
