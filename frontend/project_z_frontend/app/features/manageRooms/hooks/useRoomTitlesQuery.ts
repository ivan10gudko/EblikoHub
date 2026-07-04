import { useRoomDetailsFilterStore } from "../store/roomDetailsFilter.store";
import { useInfiniteRoomTitles } from "./useInfinityRoomTitles";

export const useRoomTitlesQuery = (roomId: number) => {

    const { sortBy, order, types, memberIds, status } = useRoomDetailsFilterStore();
    return useInfiniteRoomTitles(roomId, {
        sortBy,
        order,
        types,
        memberIds,
        ...(status && { status })
    });
};