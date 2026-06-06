import { useState, useEffect } from "react";
import { FriendCard } from "../FriendCard";
import { useUserSearch } from "~/entities/user/hooks/useUserSearch";
import { InfiniteScrollLoader } from "~/shared/ui/infinityScroll";
import type { FriendActionType } from "../../types/friends.types";


interface AddFriendTabProps {
    searchQuery: string;
    isPendingAction: boolean;
    onAction: (actionType: FriendActionType, id: string) => void; 
}

export const AddFriendTab = ({ 
    searchQuery, 
    isPendingAction, 
    onAction 
}: AddFriendTabProps) => {
    const [page, setPage] = useState(0);
    const { searchResults, isLoading, paginationInfo } = useUserSearch(searchQuery, page, 10);

    useEffect(() => {
        setPage(0);
    }, [searchQuery]);

    if (!searchQuery.trim()) {
        return (
            <div className="flex flex-col gap-4">
                <p className="text-foreground text-center py-8 text-md font-medium">
                    Use the search bar above to trigger global matchmaking. 
                    <span className="text-primary block mt-1">(@nameTag to find a person by exact nameTag)</span>
                </p>
            </div>
        );
    }

    if (isLoading && page === 0) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div 
                        key={i} 
                        className="w-full h-[92px] bg-background-muted/20 border border-border/40 rounded-2xl animate-pulse" 
                    />
                ))}
            </div>
        );
    }

    if (searchResults.length === 0 && !isLoading) {
        return (
            <div className="text-center py-12 border border-dashed border-border/40 rounded-2xl bg-background-muted/10">
                <p className="text-foreground-muted font-medium text-base">
                    No users found matching your query.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {searchResults.map((user) => (
                    <FriendCard 
                        key={user.userId} 
                        user={user} 
                        variant="add" 
                        onAction={onAction}
                        isPendingAction={isPendingAction}
                    />
                ))}
            </div>

            <InfiniteScrollLoader 
                hasNextPage={!paginationInfo.isLast} 
                isFetchingNextPage={isLoading && page > 0} 
                fetchNextPage={() => setPage(prev => prev + 1)} 
            />
        </div>
    );
};