import { useQuery } from "@tanstack/react-query";
import { roomTitleKeys } from "../model/roomTitle.queryKeys";
import { roomTitleService } from "../api/roomTitleService";



export const useSuggestTitlesToAdd = (roomId: number, userId : string) => {
    return useQuery({
        queryKey: roomTitleKeys.suggestedToAdd(roomId, userId),
        queryFn: () => roomTitleService.suggestTitlesToAdd(roomId),
        enabled: !!roomId && !!userId,
    });
};