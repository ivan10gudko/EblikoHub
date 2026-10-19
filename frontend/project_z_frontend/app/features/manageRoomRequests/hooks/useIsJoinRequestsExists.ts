import { useQuery } from "@tanstack/react-query";
import { roomRequestsService } from "../api/roomRequestsService";
import { roomRequestKeys } from "../model/roomRequests.keys";


export const useIsJoinRequestsExists = (roomId: number, isEnabled: boolean = true) => {
    return useQuery({
        queryKey: roomRequestKeys.joinRequestsExists(roomId),
        queryFn: () => roomRequestsService.isJoinRequestsExists(roomId),
        enabled: isEnabled,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
    });
};