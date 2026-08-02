import { useSuspenseQuery } from "@tanstack/react-query";
import { titleRecordService } from "../api/titleRecordService";
import type { TitleRecord } from "../model/titleRecord";

export const useTitleById = (titleId?: number) => {
    return useSuspenseQuery<TitleRecord | null>({
        queryKey: ['titleRecord', 'id', titleId],
        queryFn: async () => {
            if (!titleId) return null;
            
            return await titleRecordService.getById(titleId).catch(() => null);
        },
        staleTime: 5 * 60 * 1000, 
    });
};