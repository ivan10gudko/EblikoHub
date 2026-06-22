import { useState, useEffect } from "react";
import { friendshipService } from "../api/friendshipService";
import type { UserDtoWithFriendshipStatus } from "../model/friendship.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { PageResponse } from "~/shared/types";

export const useUserFriendshipSearch = (query: string) => {
    return useInfiniteQuery<PageResponse<UserDtoWithFriendshipStatus>, Error>({
        queryKey: ["user_friendship_search", query],
        
        queryFn: ({ pageParam }) => 
            friendshipService.searchUsersWithStatus(query, { 
                page: pageParam as number, 
                limit: 10 
            }),

        initialPageParam: 0,
        
        getNextPageParam: (lastPage) => {
            return !lastPage.last ? lastPage.number + 1 : undefined;
        },

        enabled: query.trim().length > 0,
        

        refetchOnWindowFocus: false,
    });
};