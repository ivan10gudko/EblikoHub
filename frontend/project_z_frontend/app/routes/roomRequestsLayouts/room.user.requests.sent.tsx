import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "~/features/auth";
import { redirect } from "react-router";
import { RequestStatus, RequestType } from "~/shared/types";


import { roomRequestsService, useRoomRequests } from "~/features/manageRoomRequests";
import { RoomSentRequestsTab } from "~/features/manageRoomRequests/ui/roomRequestsTabs/RoomRequestsSentTab";

export default function RoomUserRequestsInvitesPage() {
    const { userId } = useAuthStore();

    if (!userId) {
        return redirect("/auth/login");
    }


    const { data: sentRequests, isLoading } = useQuery({
        queryKey: ["room_requests", "sent"],
        queryFn: () => roomRequestsService.getRequests(userId, RequestStatus.PENDING, RequestType.JOIN_REQUEST)
    });

    const {cancelRequest, isPendingAction} = useRoomRequests();

    if (isLoading) return <div>Loading...</div>;

    return (

        <RoomSentRequestsTab
            requests={sentRequests || []}
            isPendingAction={isPendingAction}
            onCancel={(requestId: string) => cancelRequest({ roomRequestId: requestId })}
        />

    );
}