import { useParams } from "react-router";
import { useFriends } from "~/features/manageFriends/hooks/useFriends";
import { FriendsListTab } from "~/features/manageFriends/ui/FriendsTabs/FriendsListTab";

export default function FriendsIndexPage() {
    const { userId } = useParams();
    const { friends, isPendingGlobal, handleFriendAction } = useFriends(userId!, "friends");

    return (
        <FriendsListTab 
            friends={friends || []} 
            isPendingAction={isPendingGlobal} 
            onAction={handleFriendAction} 
            variant="friends" 
        />
    );
}