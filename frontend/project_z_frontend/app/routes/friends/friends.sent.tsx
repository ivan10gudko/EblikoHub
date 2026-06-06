import { useParams } from "react-router";
import { useFriends } from "~/features/manageFriends/hooks/useFriends";
import { SentInvitesTab } from "~/features/manageFriends/ui/FriendsTabs/SentInvitesTab";

export default function SentRequestsPage() {
    const { userId } = useParams();
    const { isPendingGlobal, handleFriendAction, sentRequests } = useFriends(userId!, "sent");

    return (
            <SentInvitesTab 
                sentRequests={sentRequests}
                isPendingAction={isPendingGlobal} 
                onAction={handleFriendAction} 
            />
    );
}