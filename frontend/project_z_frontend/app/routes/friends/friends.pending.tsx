import { useParams } from "react-router";
import { useFriends } from "~/features/manageFriends/hooks/useFriends";
import { PendingInvitesTab } from "~/features/manageFriends/ui/FriendsTabs/PendingInvitesTab";

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