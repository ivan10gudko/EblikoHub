import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { titleRecordService, type TitleRecord } from "~/entities/titleRecord";
import { notify } from "~/shared/lib";
import type { PageResponse } from "~/shared/types";

export const useUpdateTitleRecord = (titleId: number) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<TitleRecord>) => 
      titleRecordService.patch(titleId, updates),
    
    onSuccess: (updatedRecord: TitleRecord) => {
      queryClient.setQueriesData<InfiniteData<PageResponse<TitleRecord>>>(
        { queryKey: ['titles'] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              content: page.content.map((item) =>
                item.titleId === updatedRecord.titleId ? updatedRecord : item
              ),
            })),
          };
        }
      );
      if (updatedRecord?.apiTitleId) {
        queryClient.setQueryData(['titleRecord', updatedRecord.apiTitleId], updatedRecord);
      }
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || "Error while updating");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => titleRecordService.delete(titleId),
    onSuccess: () => {
      queryClient.setQueriesData<InfiniteData<PageResponse<TitleRecord>>>(
        { queryKey: ['titles'] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              content: page.content.filter((item) => item.titleId !== titleId),
            })),
          };
        }
      );
      notify.success("deleted!");
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || "error while deleting");
    }
  });

  return {
    updateTitle: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteTitle: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending
  };
};