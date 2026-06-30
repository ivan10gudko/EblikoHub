import { useParams } from "react-router";
import { SentInvitesTab, useFriends } from "~/features/manageFriends";

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