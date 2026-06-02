
import type { UserProfile } from "~/entities/user";
import { FriendCard } from "../FriendCard";

interface FriendsListTabProps {
    friends: (UserProfile & { friendshipId?: string })[];
    isPendingAction: boolean;
    onAction?: (actionType: "delete" | "accept" | "reject" | "send", id: string) => void;
    variant?: "friends" | "add" | "pending" | "sent" | "readonly"; 
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