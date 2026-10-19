import { useQuery } from "@tanstack/react-query";
import { roomRequestKeys } from "../model/roomRequests.keys";
import { roomRequestsService } from "../api/roomRequestsService";


export const useIsInvitesExists = (isEnabled: boolean = true) => {
    return useQuery({
        queryKey: roomRequestKeys.InvitesExists(),
        queryFn: () => roomRequestsService.isInvitesExistsByUser(),
        enabled: isEnabled,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
    });
};