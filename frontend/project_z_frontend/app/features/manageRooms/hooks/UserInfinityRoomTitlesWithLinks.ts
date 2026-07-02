import { useInfiniteQuery } from "@tanstack/react-query";
import type { RoomTitleWithSearchQueryParams } from "../model/roomTitle.types";
import { roomTitleService } from "../api/roomTitleService";

export const useInfiniteRoomTitlesWithLinks = (
    roomId: number, 
    userId: string, 
    params: RoomTitleWithSearchQueryParams
) => {
    const queryKey = ['room-titles-with-links', roomId, userId, params];

    return useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) => {
            const page = typeof pageParam === 'number' ? pageParam : 0;
            
            return roomTitleService.getRoomTitlesWithUserLinks(roomId, userId, { 
                ...params, 
                page: page 
            });
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.last) {
                return undefined;
            }
            return lastPage.number + 1;
        },
        initialPageParam: 0,
        staleTime: 1000 * 60 * 5,
    });
};