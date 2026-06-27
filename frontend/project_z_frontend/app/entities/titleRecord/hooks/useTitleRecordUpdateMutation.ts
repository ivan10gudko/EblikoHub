import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { titleRecordService, type TitleRecord } from "~/entities/titleRecord";
import { notify } from "~/shared/lib";
import type { PageResponse } from "~/shared/types";

export const useUpdateTitleRecord = (titleId: number) => {
  const queryClient = useQueryClient();

  
  const invalidateTitlesCache = () => {
    queryClient.invalidateQueries({ queryKey: ['titles'] });
  };

  
  const updateSingleTitleCache = (updatedRecord: TitleRecord) => {
    if (updatedRecord.apiTitleId) {
      queryClient.setQueryData(['titleRecord', updatedRecord.apiTitleId], updatedRecord);
    }
    
    queryClient.setQueryData(['titleRecord', 'local', updatedRecord.titleId], updatedRecord);
  };

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<TitleRecord>) => titleRecordService.patch(titleId, updates),
    onSuccess: (updatedRecord: TitleRecord) => {
      
      updateSingleTitleCache(updatedRecord);
      
      
      invalidateTitlesCache();
    }
  });

  const pinMutation = useMutation({
    mutationFn: () => titleRecordService.pinTitle(titleId),
    onSuccess: (updatedRecord: TitleRecord) => {
      updateSingleTitleCache({ ...updatedRecord, pinned: true });
      invalidateTitlesCache();
      notify.success("Pinned to top!");
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || "Error while pinning");
    }
  });

  const unpinMutation = useMutation({
    mutationFn: () => titleRecordService.unpin(),
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ['titleRecord'] });
      invalidateTitlesCache();
      notify.success("Unpinned!");
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || "Error while unpinning");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => titleRecordService.delete(titleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['titleRecord'] });
      invalidateTitlesCache();
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