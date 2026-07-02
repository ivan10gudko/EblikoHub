import { useInfiniteQuery } from "@tanstack/react-query";
import { roomService } from "../api/roomService";
import type { QueryParams } from "~/shared/types";

export const useRoomUserSearch = (
    roomId: number | null,
    name: string,
    params: QueryParams = {}
) => {
    const queryKey = ['room_users_search', roomId, name, params];

    return useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) => {
            const page = typeof pageParam === 'number' ? pageParam : 0;

            return roomService.searchUsersForRoom(roomId!, name, {
                ...params,
                page: page
            });
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage || lastPage.last || lastPage.number === undefined) {
                return undefined;
            }
            return lastPage.number + 1;
        },
        enabled: !!roomId && name.trim().length > 0,
        initialPageParam: 0,
        staleTime: 1000 * 60 * 5,
    });
};