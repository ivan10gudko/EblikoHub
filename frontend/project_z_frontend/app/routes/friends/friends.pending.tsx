import { useParams } from "react-router";
import { PendingInvitesTab, useFriends } from "~/features/manageFriends";

export default function PendingRequestsPage() {
    const { userId } = useParams();
    const { isPendingGlobal, handleFriendAction, pendingRequests } = useFriends(userId!, "pending");

    return (
            <PendingInvitesTab 
                pendingRequests={pendingRequests}
                isPendingAction={isPendingGlobal} 
                onAction={handleFriendAction} 
            />
    );
}