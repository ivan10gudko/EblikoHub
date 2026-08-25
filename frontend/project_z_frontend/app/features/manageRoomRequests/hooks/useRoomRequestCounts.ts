import { useQuery } from "@tanstack/react-query";
import { roomRequestsService } from "../api/roomRequestsService";

export const useRoomRequestCounts = (userId?: string) => {
    return useQuery({
        queryKey: ["room_request_counts", userId],
        queryFn: () => userId ? roomRequestsService.getRequestsCountsByUserId(userId) : Promise.reject("User ID required"),
        enabled: !!userId,
        placeholderData: { incomingCount: 0, outgoingCount: 0 },
        staleTime: 1000 * 60,
    });
};