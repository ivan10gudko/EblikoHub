import type { RoomRequestShort } from "../../model/room.types";
import { RoomRequestCard } from "../roomCard/roomRequestCard";
import { RoomRequestSentCard } from "../roomCard/roomRequestSentCard";

interface RoomSentRequestsTabProps {
    requests: RoomRequestShort[];
    isPendingAction: boolean;
    onCancel: (roomRequestId: string) => void;
}

export const RoomSentRequestsTab = ({
    requests = [],
    isPendingAction,
    onCancel
}: RoomSentRequestsTabProps) => {
    if (!Array.isArray(requests) || requests.length === 0) {
        return <p className="text-foreground-muted text-center py-12">No sent requests.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {requests.map((request) => (
                <RoomRequestSentCard
                    request={request}
                    isPendingAction={isPendingAction}
                    onCancel={() => onCancel(request.id)}
                />
            ))}
        </div>
    );
};