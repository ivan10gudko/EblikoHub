
import type { UserProfile } from "~/entities/user";
import { FriendCard } from "../FriendCard";
import type { FriendActionType, FriendCardVariant } from "../../types/friends.types";

interface FriendsListTabProps {
    friends: (UserProfile & { friendshipId?: string })[];
    isPendingAction: boolean;
    onAction?: (actionType: FriendActionType, id: string) => void;
    variant?: FriendCardVariant; 
}

export const FriendsListTab = ({ 
    friends, 
    isPendingAction, 
    onAction, 
    variant = "friends"
}: FriendsListTabProps) => {
    
    if (friends.length === 0) {
        return (
            <div className="text-center py-8 text-foreground/50 font-medium">
                No friends found.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {friends.map((friend) => (
                <FriendCard
                    key={friend.userId}
                    user={friend}
                    variant={variant} 
                    onAction={onAction}
                    isPendingAction={isPendingAction}
                />
            ))}
        </div>
    );
};