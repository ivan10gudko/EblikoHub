
import { InfiniteScrollLoader } from "~/shared/ui/infinityScroll";
import type { FriendActionType } from "../../types/friends.types";
import { FriendCardAdd } from "../AddFriendCard";
import { useUserFriendshipSearch } from "~/entities/friendship/hooks/useFriendshipSearch";


interface AddFriendTabProps {
    searchQuery: string;
    isPendingAction: boolean;
    onAction: (actionType: FriendActionType, id: string) => void;
}
export const AddFriendTab = ({ searchQuery, isPendingAction, onAction }: AddFriendTabProps) => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useUserFriendshipSearch(searchQuery);
    
    const searchResults = data?.pages.flatMap(p => p.content) ?? [];

    if (!searchQuery.trim()) {
        return <p className="text-center py-10">Start typing to search for friends...</p>;
    }

    if (isLoading && searchResults.length === 0) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-[92px] bg-background-muted/20 animate-pulse rounded-2xl" />
                ))}
            </div>
        );
    }

    if (!isLoading && searchResults.length === 0) {
        return <p className="text-center py-10">No users found.</p>;
    }

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {searchResults.map((user) => (
                    <FriendCardAdd 
                        key={user.userId} 
                        user={user} 
                        onAction={onAction} 
                        isPendingAction={isPendingAction} 
                    />
                ))}
            </div>
            
            <InfiniteScrollLoader
                hasNextPage={!!hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
            />
        </div>
    );
};