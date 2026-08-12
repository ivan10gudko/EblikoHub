import { useQuery } from "@tanstack/react-query";
import { roomBanService } from "../api/roomBanService";

export const useRoomBans = (roomId: number) => {
    return useQuery({
        queryKey: ['rooms', roomId, 'bans'],
        
        queryFn: () => roomBanService.findAllByRoom(roomId),

        staleTime: 1000 * 60, 
    });
};