import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { titleRecordService, type TitleRecord } from "~/entities/titleRecord";
import { updateInfiniteQuery } from "~/shared/helpers/updateInfinityQuery";
import { notify } from "~/shared/lib";
import type { PageResponse } from "~/shared/types";

export const useUpdateTitleRecord = (titleId: number) => {
  const queryClient = useQueryClient();

  const updateTitlesCache = (updater: (content: TitleRecord[]) => TitleRecord[]) => {
    queryClient.setQueriesData<InfiniteData<PageResponse<TitleRecord>>>(
      { queryKey: ['titles'] },
      (oldData) => updateInfiniteQuery({
        oldData,
        getContent: (page) => page.content,
        setContent: (page, newContent) => ({ ...page, content: newContent }),
        updater
      })
    );
  };

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<TitleRecord>) => titleRecordService.patch(titleId, updates),
    onSuccess: (updatedRecord: TitleRecord) => {
      updateTitlesCache((content) =>
        content.map(item => item.titleId === updatedRecord.titleId ? updatedRecord : item)
      );
    }
  });

  const pinMutation = useMutation({
    mutationFn: () => titleRecordService.pinTitle(titleId),
    onSuccess: (updatedRecord: TitleRecord) => {
      updateTitlesCache((content) =>
        content.map((item) => ({
          ...item,
          pinned: item.titleId === updatedRecord.titleId
        }))
      );

      if (updatedRecord?.apiTitleId) {
        queryClient.setQueryData(['titleRecord', updatedRecord.apiTitleId], { ...updatedRecord, pinned: true });
      }
      notify.success("Pinned to top!");
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || "Error while pinning");
    }
  });

  const unpinMutation = useMutation({
    mutationFn: () => titleRecordService.unpin(),
    onSuccess: () => {
      updateTitlesCache((content) =>
        content.map((item) => ({ ...item, pinned: false }))
      );
      notify.success("Unpinned!");
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || "Error while unpinning");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => titleRecordService.delete(titleId),
    onSuccess: () => {
      updateTitlesCache((content) =>
        content.filter(item => item.titleId !== titleId)
      );
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