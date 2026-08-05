import { friendshipService } from "../api/friendshipService";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { PageResponse } from "~/shared/types";
import type { WithFriendship } from "../model/friendship.types";

export const useUserFriendshipSearch = <T>(query: string) => {
    return useInfiniteQuery<PageResponse<WithFriendship<T>>, Error>({
        queryKey: ["user_friendship_search", query],

        queryFn: ({ pageParam }) =>
            friendshipService.searchUsersWithStatus<T>(query, {
                page: pageParam as number,
                limit: 10
            }),

        initialPageParam: 0,

        getNextPageParam: (lastPage) => {
            return !lastPage.last ? lastPage.number + 1 : undefined;
        },

        enabled: query.trim().length > 0,
        staleTime: 1000 * 60 * 2,

        refetchOnWindowFocus: false,
    });
};