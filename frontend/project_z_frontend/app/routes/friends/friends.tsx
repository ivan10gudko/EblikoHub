import { Outlet, useParams } from "react-router";
import { useAuthStore } from "~/features/auth";
import { FriendsSidebar } from "~/features/manageFriends/ui/FriendsSidebar";
import { useFriends } from "~/features/manageFriends/hooks/useFriends";

export default function FriendsLayout() {
    const { userId } = useParams<{ userId: string }>();
    const { userId: currentUserId } = useAuthStore();
    

    const isOwnProfile = userId === currentUserId;


    const { counts } = useFriends(userId!, "friends"); 

    if (!userId) throw new Response("Not Found", { status: 404 });

    return (
        <div className="flex gap-6 p-6">
            <FriendsSidebar 
                userId={userId} 
                friendsCount={counts.friendsCount}
                pendingCount={counts.pendingCount}
                sentCount={counts.sentCount}
                isReadOnly={!isOwnProfile}
            /> 
            <main className="flex-1">
                <Outlet /> 
            </main>
        </div>
    );
}