
import type { UserProfile } from "~/entities/user";
import { FriendCard } from "../FriendCard";
import type { FriendActionType, FriendCardVariant } from "../../types/friends.types";
import type { FriendRequestDto } from "~/entities/friendship";

interface FriendsListTabProps {
    friends: FriendRequestDto[];
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
            <h1 className="text-primary">
                you dont have friends :(
            </h1>
        );
    }
    return (
        <div className="grid grid-cols-1 gap-4">
            {friends.map((item) => (
                <FriendCard
                    key={item.user.userId}
                    user={{
                        ...item.user,
                        friendshipId: item.friendshipId
                    }}
                    variant={variant}
                    onAction={onAction}
                    isPendingAction={isPendingAction}
                />
            ))}
        </div>
    );
};