import { useInfiniteQuery } from "@tanstack/react-query";
import type { RoomTitleQueryParameters } from "../model/roomTitleSummary.types";
import { roomTitleService } from "../api/roomTitleService";

export const useInfiniteRoomTitles = (roomId: number, params: RoomTitleQueryParameters) => {
    const queryKey = ['room-titles', roomId, params];
    return useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) => {
            const page = typeof pageParam === 'number' ? pageParam : 0;
            
            return roomTitleService.getRoomTitles(roomId, { 
                ...params, 
                page: page 
            });
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage.content || lastPage.content.last) {
                return undefined;
            }
            return lastPage.content.number + 1;
        },
        initialPageParam: 0,
        staleTime: 1000 * 60 * 5,
    });
};