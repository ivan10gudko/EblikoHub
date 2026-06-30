import { useParams } from "react-router";
import { useAuthStore } from "~/features/auth";
import { FriendsListTab, useFriends } from "~/features/manageFriends";

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