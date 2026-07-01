import { useMutation, useQueryClient } from "@tanstack/react-query";
import { titleRecordService, type TitleRecord } from "~/entities/titleRecord";
import { notify } from "~/shared/lib";

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
    onError: (error: any) => {
      notify.error(error.response?.data?.message || "Failed to save changes");
    }
  });

  const pinMutation = useMutation({
    mutationFn: () => titleRecordService.pinTitle(titleId),
    onSuccess: () => {
      refreshAllCaches();
      notify.success("Pinned to top!");
    },
    onError: (error: any) => {
      console.error(error);
      notify.error(error.response?.data?.message || "Error while pinning");
    }
  });

  const unpinMutation = useMutation({
    mutationFn: () => titleRecordService.unpin(),
    onSuccess: () => {
      refreshAllCaches();
      notify.success("Unpinned!");
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || "Error while unpinning");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => titleRecordService.delete(titleId),
    onSuccess: () => {
      refreshAllCaches();
    }
  });

  return {
    updateTitle: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteTitle: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    pinTitle: pinMutation.mutate,
    isPinning: pinMutation.isPending,
    unpinTitle: () => unpinMutation.mutate(),
    isUnpinning: unpinMutation.isPending
  };
};