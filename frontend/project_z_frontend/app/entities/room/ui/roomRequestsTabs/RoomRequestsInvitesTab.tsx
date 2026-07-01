import type { RoomRequestShort } from "../../model/room.types";
import { RoomRequestCard } from "../roomCard/roomRequestCard";


interface RoomRequestsInvitesTabProps {
    requests: RoomRequestShort[];
    isPendingAction: boolean;
    onAccept: (requestId: string) => void;
    onReject: (requestId: string) => void;
}

export const RoomRequestsInvitesTab = ({
    requests = [],
    isPendingAction,
    onAccept,
    onReject
}: RoomRequestsInvitesTabProps) => {

    if (!Array.isArray(requests) || requests.length === 0) {
        return (
            <p className="text-foreground-muted text-center py-12">
                No pending invitations right now.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {requests.map((request) => (
                <RoomRequestCard
                    key={request.id}
                    request={request}
                    isPendingAction={isPendingAction}
                    onAccept={() => onAccept(request.id)}
                    onReject={() => onReject(request.id)}
                />
            ))}
        </div>
    );
};