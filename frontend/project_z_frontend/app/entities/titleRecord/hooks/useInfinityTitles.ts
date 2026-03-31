import { useInfiniteQuery,} from '@tanstack/react-query';
import { titleRecordService } from '../api/titleRecordService';
import type { TitleParams } from '../model/titleRecord';

export const useInfinityTitles = (userId: number, params: TitleParams) => {
    return useInfiniteQuery({
        queryKey: ['titles', userId, params],
        queryFn: ({ pageParam = 1 }) =>
            titleRecordService.get(userId, { ...params, page: pageParam }),
        getNextPageParam: (lastPage) => {
            return lastPage.number< lastPage.totalPages
                ? lastPage.number + 1
                : undefined;
        },
        initialPageParam: 1,
    });
};