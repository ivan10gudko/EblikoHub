import { useQuery } from "@tanstack/react-query";
import { friendshipService } from "../api/friendshipService";
import { friendshipKeys } from "../model/friendship.keys";

export const usePendingFriendRequests = (userId: string, isOwn: boolean) => {
    return useQuery({
        queryKey: friendshipKeys.pendingRequests(userId),
        queryFn: () => friendshipService.hasPendingFriendRequests(),
        enabled: isOwn,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
    });
};