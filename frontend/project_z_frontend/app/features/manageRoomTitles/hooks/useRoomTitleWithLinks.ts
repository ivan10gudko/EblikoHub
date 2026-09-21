import { useQuery } from "@tanstack/react-query";
import { roomTitleService } from "~/features/manageRoomTitles/api/roomTitleService";
import { roomTitleKeys } from "~/features/manageRoomTitles/model/roomTitle.queryKeys";

export const useRoomTitleWithLinks = (roomId: number, roomTitleId: string) => {
    return useQuery({
        queryKey: [roomTitleKeys.detailsWithLinks(roomId, roomTitleId)],
        queryFn: () => roomTitleService.getRoomTitlesWithLinks(roomId, roomTitleId),
        enabled: !!roomTitleId,
        staleTime: 1000 * 60 * 5,
    });
};