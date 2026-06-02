import { useState } from "react";
import { useFriends } from "~/features/manageFriends/hooks/useFriends";
import { FriendsSidebar } from "~/features/manageFriends/ui/FriendsSidebar";
import { FriendsListTab } from "./FriendsTabs/FriendsListTab";
import { Button } from "~/shared/ui/Button";
import MenuIcon from '@mui/icons-material/Menu';

export const UserFriendsView = ({ targetUserId }: { targetUserId: string }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { friends, counts } = useFriends(targetUserId, "friends");

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-8rem)] relative w-[90%] sm:gap-8 mx-auto my-8">
            <div
                className={`fixed inset-0 bg-card/60 backdrop-blur-xl z-[999] transition-all duration-300 flex justify-center p-6 pt-[73px]
                    md:relative md:inset-auto md:bg-transparent md:backdrop-blur-none md:z-auto md:p-0 md:pt-0 md:flex md:w-72 md:shrink-0
                    ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-4 md:opacity-100 md:pointer-events-auto md:translate-y-0"}
                `}
                onClick={() => setIsSidebarOpen(false)}
            >
                <div className="relative w-72 md:w-full h-full md:h-auto">
                    <FriendsSidebar
                        activeTab="friends"
                        onTabChange={() => setIsSidebarOpen(false)}
                        friendsCount={counts.friendsCount}
                        isReadOnly={true}
                        userId={targetUserId}
                    />
                </div>
            </div>

            <main className="flex-1 bg-background/20 border border-border/40 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

                <div className="flex items-center gap-4 border-b border-border/40 pb-5">
                    <Button
                        variant="outline"
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden flex items-center justify-center p-2 rounded-xl"
                    >
                        <MenuIcon fontSize="small" className="text-foreground" />
                    </Button>
                    <h1 className="text-2xl font-black tracking-tight text-foreground capitalize">
                        Friends
                    </h1>
                </div>

                <div className="flex flex-col gap-6 overflow-y-auto max-h-[60vh] pr-1">
                    <FriendsListTab
                        friends={friends || []}
                        isPendingAction={false}
                        onAction={() => { }}
                        variant="readonly"
                    />
                </div>
            </main>
        </div>
    );
};