import type { FriendActionType, PendingFriendRequest } from "../../types/friends.types";
import { FriendCard } from "../FriendCards/FriendCard";

interface PendingInvitesTabProps {
    pendingRequests: PendingFriendRequest[];
    isPendingAction: boolean;
    onAction: (actionType: FriendActionType, id: string) => void;
}

export const PendingInvitesTab = ({ 
    pendingRequests = [], 
    isPendingAction, 
    onAction 
}: PendingInvitesTabProps) => {
    
    if (!Array.isArray(pendingRequests) || pendingRequests.length === 0) {
        return <p className="text-foreground text-center py-12 col-span-2">No pending invitations right now.</p>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendingRequests.map((user) => (
                user?.userId ? (
                    <FriendCard 
                        key={user.userId} 
                        user={user} 
                        variant="pending" 
                        onAction={onAction}
                        isPendingAction={isPendingAction}
                    />
                ) : null
            ))}
        </div>
    );
};