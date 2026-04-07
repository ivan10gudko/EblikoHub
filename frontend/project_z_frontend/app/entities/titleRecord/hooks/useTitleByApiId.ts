import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { titleRecordService } from "../api/titleRecordService";
import type { TitleRecord } from "../model/titleRecord";

export const useTitleByApiId = (apiTitleId?: number) => {
    return useSuspenseQuery <TitleRecord | null>({
        queryKey: ['titleRecord', apiTitleId],
        queryFn: async () => {

            if (!apiTitleId) return null;
            
            return await titleRecordService.getByApiTitleId(apiTitleId).catch(() => null);
        },
        staleTime: 5 * 60 * 1000, 
    });
};