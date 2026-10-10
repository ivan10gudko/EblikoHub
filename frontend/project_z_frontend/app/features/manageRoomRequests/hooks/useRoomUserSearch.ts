import { useInfiniteQuery } from "@tanstack/react-query";
import type { QueryParams } from "~/shared/types";
import { roomRequestsService } from "~/features/manageRoomRequests";
import { roomKeys } from "~/entities/room/model/room.keys";

export const useRoomUserSearch = (
    roomId: number | null,
    name: string,
    params: QueryParams = {}
) => {
    const queryKey = roomKeys.userSearch(roomId, name, params);

    return useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) => {
            const page = typeof pageParam === 'number' ? pageParam : 0;

            return roomRequestsService.searchUsersForRoom(roomId!, name, {
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