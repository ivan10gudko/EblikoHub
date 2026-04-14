import { useInfiniteQuery,} from '@tanstack/react-query';
import { titleRecordService } from '../api/titleRecordService';
import type { TitleParams } from '../model/titleRecord';

export const useInfinityTitles = (userId: string | null, params: TitleParams) => {
    return useInfiniteQuery({
        queryKey: ['titles', userId, params],
        queryFn: ({ pageParam = 0 }) =>{
            return titleRecordService.get(userId!, { ...params, page: pageParam })},
        getNextPageParam: (lastPage) => {
            if(lastPage.last)return undefined
            return lastPage.number + 1;
        },
        enabled:!!userId,
        initialPageParam: 0,
        staleTime: 5000,
        refetchOnWindowFocus: false,
    });
};