import { useInfiniteQuery } from '@tanstack/react-query';
import { roomService } from '../api/roomService';
import type { RoomQueryParameters } from '../model/room.types';

type RoomsQueryKey = ['rooms', string | null, RoomQueryParameters];

export const useInfiniteRooms = (userId: string | null, params: RoomQueryParameters) => {
    const queryKey: RoomsQueryKey = ['rooms', userId, params];

    return useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) => {

            const page = typeof pageParam === 'number' ? pageParam : 0;
            
            return roomService.getByUserId(userId!, { 
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
        enabled: !!userId,
        initialPageParam: 0,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
};