
import type { UserProfile } from "~/entities/user";
import { FriendCard } from "../FriendCards/FriendCard";
import type { FriendActionType, FriendCardVariant } from "../../types/friends.types";
import type { FriendRequestDto } from "~/entities/friendship";
import { ReadOnlyFriendCard } from "../FriendCards/FriendReadOnlyCard";

interface FriendsListTabProps {
    friends: FriendRequestDto[];
    isPendingAction: boolean;
    onAction?: (actionType: FriendActionType, id: string) => void;
    variant?: FriendCardVariant;
    isOwn?: boolean;
}

export const FriendsListTab = ({
    friends,
    isPendingAction,
    onAction,
    variant = "friends",
    isOwn = true
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
            {friends.map((item) => {
                const userData = { ...item.user, friendshipId: item.friendshipId };

                return isOwn ? (
                    <FriendCard
                        key={item.user.userId}
                        user={userData}
                        variant={variant}
                        onAction={onAction}
                        isPendingAction={isPendingAction}
                    />
                ) : (
                    <ReadOnlyFriendCard
                        key={item.user.userId}
                        user={userData}
                    />
                );
            })}
        </div>
    );
};