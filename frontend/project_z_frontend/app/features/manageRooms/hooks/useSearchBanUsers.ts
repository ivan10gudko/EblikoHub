import { useInfiniteQuery } from "@tanstack/react-query";
import type { UserParams } from "~/entities/user/model/user.types";
import { roomBanService } from "../api/roomBanService";
// Припускаємо, що у тебе є файл для ключів банів, або налаштуй шлях самостійно
export const useInfiniteRoomBanSearch = (
    roomId: number,
    params: UserParams,
    enabled: boolean = true // Додано прапорець для контролю активності запиту
) => {
    // ВАЖЛИВО: додаємо params у ключ, щоб React Query реагував на зміну тексту
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
        enabled, // Запит виконається тільки якщо true
    });
};