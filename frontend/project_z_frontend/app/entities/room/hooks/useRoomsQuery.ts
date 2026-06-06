import { useInfiniteRooms } from "~/entities/room/hooks/useInfinityRooms";
import { useRoomFilterStore } from "../store/rooms.store";

export const useRoomsQuery = (userId: string | null) => {

    const { search, sortBy, order } = useRoomFilterStore();
    
    return useInfiniteRooms(userId, { 
        search, 
        sortBy, 
        order 
    });
};