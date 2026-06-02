import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuthStore } from "~/features/auth";
import { MyFriendsView, UserFriendsView } from "~/features/manageFriends";

export const FriendsPage = () => {
    const { userId: currentUserId } = useAuthStore();
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!userId && currentUserId) {
            navigate(`/friends/${currentUserId}`, { replace: true });
        }
    }, [userId, currentUserId, navigate]);

    const targetUserId = userId || currentUserId;

    if (!targetUserId) {
        return (
            <div className="flex flex-col md:flex-row min-h-[calc(100vh-8rem)] relative w-[90%] sm:gap-8 mx-auto my-8">
                <div className="w-full md:w-72 h-48 md:min-h-[calc(100vh-64px)] bg-background-muted/20 border border-border/40 rounded-3xl animate-pulse" />
                <main className="flex-1 bg-background/20 border border-border/40 rounded-3xl p-6 sm:p-8 animate-pulse">
                    <div className="h-8 bg-background-muted/40 w-48 rounded-lg mb-6" />
                    <div className="space-y-4">
                        <div className="h-20 bg-background-muted/30 rounded-xl" />
                        <div className="h-20 bg-background-muted/30 rounded-xl" />
                        <div className="h-20 bg-background-muted/30 rounded-xl" />
                    </div>
                </main>
            </div>
        );
    }

    const isOwnProfile = targetUserId === currentUserId;

    return isOwnProfile ? (
        <MyFriendsView targetUserId={targetUserId} />
    ) : (
        <UserFriendsView targetUserId={targetUserId} />
    );
};

export default FriendsPage;