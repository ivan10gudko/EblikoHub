import { useMutation } from "@tanstack/react-query";
import { titleRecordService } from "../api/titleRecordService";
import { queryClient } from "~/shared/lib";
import toast from "react-hot-toast";
import type { CreateTitleRecord } from "../model/titleRecord";
export const useCreateTitleRecord = () => {

    const createMutation = useMutation({
        mutationFn: (title: CreateTitleRecord) => titleRecordService.post(title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['titles'] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Something went wrong";
            toast.error(message);
        }
    });

    return {
        createNewTitleRecord: (title: CreateTitleRecord, options?: any) => createMutation.mutate(title, options),
        isCreating: createMutation.isPending
    };
};