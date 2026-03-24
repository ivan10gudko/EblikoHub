import { useQuery } from "@tanstack/react-query";
import { titleRecordService } from "../api/titleRecordService";
import type { TitleRecord } from "../model/titleRecord";

export const useTitleByApiId = (jikanId: number) => {
    return useQuery<TitleRecord | null>({
        queryKey: ['titleRecord', jikanId],
        queryFn: async () => {
            return await titleRecordService.getByJikanId(jikanId).catch(() => null);
        },
        staleTime: 5 * 60 * 1000, 
    });
};