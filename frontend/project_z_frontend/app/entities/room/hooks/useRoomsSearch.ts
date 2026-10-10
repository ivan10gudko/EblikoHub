import { useInfiniteQuery } from "@tanstack/react-query";
import { roomService } from "../api/roomService";
import type { PageResponse } from "~/shared/types";
import type { RoomSearchResult } from "../model/room.types";

export const useRoomSearch = (roomName: string) => {
    return useInfiniteQuery<PageResponse<RoomSearchResult>, Error>({
        queryKey: ["room_search", roomName],
        
        queryFn: ({ pageParam }) => 
            roomService.searchRoomByName(roomName, { 
                page: pageParam as number, 
                limit: 10 
            }),

        initialPageParam: 0,
        
        getNextPageParam: (lastPage) => {
            return !lastPage.last ? lastPage.number + 1 : undefined;
        },

        enabled: roomName.trim().length > 0,
        
        staleTime: 1000 * 60 * 2,
        
        refetchOnWindowFocus: false,
    });
};