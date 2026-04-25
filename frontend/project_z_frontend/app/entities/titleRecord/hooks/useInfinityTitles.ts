import { useInfiniteQuery, } from '@tanstack/react-query';
import { titleRecordService } from '../api/titleRecordService';
import type { TitleParams } from '../model/titleRecord';

type TitlesQueryKey = ['titles', string | null, TitleParams];
export const useInfinityTitles = (userId: string | null, params: TitleParams) => {
    const queryKey: TitlesQueryKey = ['titles', userId, params];

    const query = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam = 0 }) =>
            titleRecordService.get(userId!, { ...params, page: pageParam }),
        getNextPageParam: (lastPage) => {
            if (lastPage.last) return undefined;
            return lastPage.number + 1;
        },
        enabled: !!userId,
        initialPageParam: 0,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
    return { ...query, queryKey };
};