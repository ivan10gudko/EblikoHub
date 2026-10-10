import type { FriendActionType, PendingFriendRequest } from "../../types/friends.types";
import { FriendCard } from "../FriendCards/FriendCard";

interface SentInvitesTabProps {
    sentRequests: PendingFriendRequest[];
    isPendingAction: boolean;
    onAction: (actionType: FriendActionType, id: string) => void; 
}

export const SentInvitesTab = ({ 
    sentRequests = [], 
    isPendingAction, 
    onAction 
}: SentInvitesTabProps) => {
    
    if (!Array.isArray(sentRequests) || sentRequests.length === 0) {
        return <p className="text-foreground text-center py-12 col-span-2">You haven't sent any friend requests yet.</p>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sentRequests.map((user) => (
                user?.userId ? (
                    <FriendCard 
                        key={user.userId} 
                        user={user} 
                        variant="sent" 
                        onAction={onAction}
                        isPendingAction={isPendingAction}
                    />
                ) : null
            ))}
        </div>
    );
};