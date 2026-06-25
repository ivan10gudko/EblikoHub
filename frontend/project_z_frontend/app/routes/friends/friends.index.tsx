import { useParams } from "react-router";
import { useAuthStore } from "~/features/auth";
import { useFriends } from "~/features/manageFriends/hooks/useFriends";
import { FriendsListTab } from "~/features/manageFriends/ui/FriendsTabs/FriendsListTab";

export default function FriendsIndexPage() {
    const { userId } = useParams();
    const { friends, isPendingGlobal, handleFriendAction } = useFriends(userId!, "friends");
    const { userId: currentUserId } = useAuthStore();
    const isOwn = currentUserId === userId;
    return (
        <FriendsListTab
            friends={friends || []}
            isPendingAction={isPendingGlobal}
            onAction={handleFriendAction}
            variant="friends"
            isOwn = {isOwn}
        />
    );
}