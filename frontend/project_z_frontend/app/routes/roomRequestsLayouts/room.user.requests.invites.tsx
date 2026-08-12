
import { useQuery } from "@tanstack/react-query";
import { roomService } from "~/entities/room/api/roomService";
import { RequestStatus, RequestType, } from "~/shared/types";
import { ensureAuthenticated, useAuthStore } from "~/features/auth";
import { redirect } from "react-router";
import { roomRequestsService, useRoomRequests } from "~/features/manageRoomRequests";
import { RoomRequestsInvitesTab } from "~/features/manageRoomRequests/ui/roomRequestsTabs/RoomRequestsInvitesTab";

export default function RoomUserRequestsInvitesPage() {
    const queryKey = ["room_requests"];
    const { userId } = useAuthStore();

    if (!userId) {
        return redirect("/auth/login");
    }

    const { data: requests, isLoading } = useQuery({
        queryKey,
        queryFn: () => roomRequestsService.getRequests(userId, RequestStatus.PENDING, RequestType.INVITE)
    });

    const { acceptRequest, rejectRequest, isPendingAction } = useRoomRequests();

    if (isLoading) return <div>Loading...</div>;

    return (
        <RoomRequestsInvitesTab
            requests={requests || []}
            isPendingAction={isPendingAction}
            onAccept={(requestId) => acceptRequest({ roomRequestId: requestId })}
            onReject={(requestId) => rejectRequest({ roomRequestId: requestId })}
        />
    );
}