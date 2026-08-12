import { useInfiniteQuery } from "@tanstack/react-query";
import type { UserParams } from "~/entities/user/model/user.types";
import { roomBanService } from "../api/roomBanService";
export const useInfiniteRoomBanSearch = (
    roomId: number,
    params: UserParams,
    enabled: boolean = true 
) => {
    const queryKey = ['user', roomId, 'search', params]; 

    return useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) => {
            const page = typeof pageParam === 'number' ? pageParam : 0;
            return roomBanService.searchUsers(roomId, {
                ...params,
                page: page
            });
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.last) return undefined;
            return lastPage.number + 1;
        },
        initialPageParam: 0,
        staleTime: 1000 * 60 * 5,
        enabled, 
    });
};