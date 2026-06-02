import { useState } from "react";
import { useFriends } from "~/features/manageFriends/hooks/useFriends";
import { useUserSearch } from "~/entities/user/hooks/useUserSearch";
import { FriendsSidebar } from "~/features/manageFriends/ui/FriendsSidebar";
import { SearchBar } from "~/features/search";
import type { TabType } from "../types/friends.types";
import { FriendsListTab } from "./FriendsTabs/FriendsListTab";
import { AddFriendTab } from "./FriendsTabs/AddFriendTab";
import { PendingInvitesTab } from "./FriendsTabs/PendingInvitesTab";
import { SentInvitesTab } from "./FriendsTabs/SentInvitesTab";
import { Button } from "~/shared/ui/Button";
import MenuIcon from '@mui/icons-material/Menu';


export const MyFriendsView = ({ targetUserId }: { targetUserId: string }) => {
    const [activeTab, setActiveTab] = useState<TabType>("friends");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { counts, friends, pendingRequests, sentRequests, handleFriendAction, isPendingGlobal } = useFriends(targetUserId, activeTab);
    const { isLoading: isSearchLoadingMatrix } = useUserSearch(searchQuery);

    const filteredFriends = (friends || []).filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.nameTag.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setSearchQuery("");
        setIsSidebarOpen(false);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-8rem)] relative w-[90%] sm:gap-8 mx-auto my-8">

            <div
                className={`fixed inset-0 bg-card/60 backdrop-blur-xl z-[999] transition-all duration-300 flex justify-center p-6 pt-[73px]
                    md:relative md:inset-auto md:bg-transparent md:backdrop-blur-none md:z-auto md:p-0 md:pt-0 md:flex md:w-72 md:shrink-0
                    ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-4 md:opacity-100 md:pointer-events-auto md:translate-y-0"}
                `}
                onClick={() => setIsSidebarOpen(false)}
            >
                <div
                    className="w-full max-w-sm md:max-w-none md:w-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    <FriendsSidebar
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        friendsCount={counts.friendsCount}
                        pendingCount={counts.pendingCount}
                        sentCount={counts.sentCount}
                        userId={targetUserId}
                    />
                </div>
            </div>

            <main className="flex-1 bg-background/20 border border-border/40 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 rounded-xl">
                            <MenuIcon fontSize="small" className="text-foreground" />
                        </Button>
                        <h1 className="text-2xl font-black tracking-tight text-foreground capitalize">
                            {activeTab === "friends" && "All Friends"}
                            {activeTab === "add" && "Find New Friends"}
                            {activeTab === "pending" && "Friend Requests"}
                            {activeTab === "sent" && "Sent Requests"}
                        </h1>
                    </div>

                    {activeTab === "add" && (
                        <div className="w-full sm:w-72">
                            <SearchBar
                                initialValue={searchQuery}
                                onChange={(val) => setSearchQuery(val)}
                                onSearch={(query) => setSearchQuery(query)}
                                debounceMs={400}
                                isLoading={isSearchLoadingMatrix}
                                placeholder="Enter global username..."
                                minLength={1}
                                clearOnSubmit={false}
                                className="!max-w-full bg-background-muted/40 border-border/60 rounded-xl text-foreground text-sm focus-within:border-primary/60 transition-colors"
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-6 overflow-y-auto max-h-[60vh] pr-1">
                    {activeTab === "friends" && <FriendsListTab friends={filteredFriends} isPendingAction={isPendingGlobal} onAction={handleFriendAction} variant={activeTab} />}
                    {activeTab === "add" && <AddFriendTab searchQuery={searchQuery} isPendingAction={isPendingGlobal} onAction={handleFriendAction} />}
                    {activeTab === "pending" && <PendingInvitesTab pendingRequests={pendingRequests} isPendingAction={isPendingGlobal} onAction={handleFriendAction} />}
                    {activeTab === "sent" && <SentInvitesTab sentRequests={sentRequests} isPendingAction={isPendingGlobal} onAction={handleFriendAction} />}
                </div>
            </main>
        </div>
    );
};