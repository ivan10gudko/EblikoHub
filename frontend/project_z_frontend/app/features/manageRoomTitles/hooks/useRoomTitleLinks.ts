import { useQuery } from "@tanstack/react-query";
import { roomTitleKeys } from "../model/roomTitle.queryKeys";
import { roomTitleService } from "../api/roomTitleService";


export const useRoomTitleLinks = (roomTitleId: string, roomId: number) => {
    return useQuery({
        queryKey: roomTitleKeys.userLinks(roomId, roomTitleId),
        queryFn: () => roomTitleService.getUserLinksByRoomTitleId(roomTitleId, roomId),
        enabled: !!roomTitleId && !!roomId,
    });
};