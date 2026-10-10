import { useInfiniteQuery } from '@tanstack/react-query';
import { titleRecordService } from '../api/titleRecordService';
import type { TitleParams } from '../model/titleRecord';
import { titleRecordKeys, type TitlesQueryKey } from '../model/titleRecord.queryKeys';

export type UseInfinityTitlesOptions = {
    roomId?: number;
    noLinksToRoom?: boolean;
};

export const useInfinityTitles = (
    userId: string | null,
    params: TitleParams,
    options?: UseInfinityTitlesOptions,
) => {
    const isNoLinks = options?.noLinksToRoom === true && options.roomId != null;

    const queryKey: TitlesQueryKey = isNoLinks
        ? titleRecordKeys.noLinksList(userId, options!.roomId!, params)
        : titleRecordKeys.list(userId, params);

    const query = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam = 0 }) =>
            isNoLinks
                ? titleRecordService.getTitlesWithNoLinksToRoom(userId!, options!.roomId!, { ...params, page: pageParam })
                : titleRecordService.get(userId!, { ...params, page: pageParam }),
        getNextPageParam: (lastPage) => {
            if (lastPage.last) return undefined;
            return lastPage.number + 1;
        },
        enabled: !!userId && (!options?.noLinksToRoom || options.roomId != null),
        initialPageParam: 0,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
    return { ...query, queryKey };
};
