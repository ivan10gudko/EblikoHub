import { useMutation } from "@tanstack/react-query";
import { titleRecordService } from "../api/titleRecordService";
import { notify, queryClient } from "~/shared/lib";
import type { CreateTitleRecord } from "../model/titleRecord";
export const useCreateTitleRecord = () => {

    const createMutation = useMutation({
        mutationFn: (title: CreateTitleRecord) => titleRecordService.post(title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['titles'] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Something went wrong";
            notify.error(message);
        }
    });

    return {
        createNewTitleRecord: (title: CreateTitleRecord, options?: any) => createMutation.mutate(title, options),
        isCreating: createMutation.isPending
    };
};