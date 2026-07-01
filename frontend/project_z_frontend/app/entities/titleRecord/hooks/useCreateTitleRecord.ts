import { useMutation, type MutateOptions } from "@tanstack/react-query";
import { titleRecordService } from "../api/titleRecordService";
import { notify, queryClient } from "~/shared/lib";
import type { CreateTitleRecord, TitleRecord } from "../model/titleRecord";
import { getErrorMessage } from "~/shared/utils";

export const useCreateTitleRecord = () => {
  const createMutation = useMutation({
    mutationFn: (title: CreateTitleRecord) => titleRecordService.post(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['titles'] });
    },
    onError: (error: unknown) => {
      notify.error(getErrorMessage(error, "Something went wrong"));
    },
  });

  return {
    createNewTitleRecord: (
      title: CreateTitleRecord,
      options?: MutateOptions<TitleRecord, Error, CreateTitleRecord>,
    ) => createMutation.mutate(title, options),
    isCreating: createMutation.isPending,
  };
};
