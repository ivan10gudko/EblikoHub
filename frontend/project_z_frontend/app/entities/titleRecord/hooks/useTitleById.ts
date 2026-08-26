import { useQuery } from "@tanstack/react-query";
import { titleRecordService } from "../api/titleRecordService";
import type { TitleRecord } from "../model/titleRecord";
import { titleRecordKeys } from "../model/titleRecord.queryKeys";

export const useTitleById = (titleId?: number) => {
    return useQuery<TitleRecord | null>({
        queryKey: titleRecordKeys.detail(titleId),
        queryFn: async () => {
            if (!titleId) return null;

            return await titleRecordService.getById(titleId).catch(() => null);
        },
        staleTime: 5 * 60 * 1000,
        enabled: !!titleId,
    });
};