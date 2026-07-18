import { useQuery } from "@tanstack/react-query";
import { roomBanService } from "../api/roomBanService"; // підкоригуй шлях за потреби

export const useRoomBans = (roomId: number) => {
    return useQuery({
        // Унікальний ключ для списку банів конкретної кімнати
        queryKey: ['rooms', roomId, 'bans'],
        
        queryFn: () => roomBanService.findAllByRoom(roomId),
        
        // Дані вважатимуться свіжими протягом 1 хвилини. 
        // За потреби можна змінити або прибрати.
        staleTime: 1000 * 60, 
    });
};