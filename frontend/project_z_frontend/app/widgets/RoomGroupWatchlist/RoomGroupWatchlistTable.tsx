import { RoomGroupWatchlistRow } from "./RoomGroupWatchlistRow";
import { RoomGroupWatchlistSkeleton } from "./RoomGroupWatchlistSkeleton";
import type { UserCacheItem } from "./RoomMemberRow";
import type { useRoomTitlesQuery } from "../RoomDetailsManager";

interface RoomGroupWatchlistTableProps {
    titlesData: ReturnType<typeof useRoomTitlesQuery>["data"];
    isLoading: boolean;
}

export const RoomGroupWatchlistTable = ({ titlesData, isLoading }: RoomGroupWatchlistTableProps) => {
    const titles = titlesData?.pages.flatMap((page) => page.content ?? []) ?? [];

    const mergedUsersCache: Record<string, UserCacheItem> = titlesData?.pages.reduce(
        (acc, page) => {
            if (page.usersCache) {
                Object.assign(acc, page.usersCache);
            }
            return acc;
        },
        {} as Record<string, UserCacheItem>
    ) ?? {};

    if (isLoading) return <RoomGroupWatchlistSkeleton />;

    return (
        <div className="bg-card border border-border rounded-2xl p-4 w-full flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">
                    Group Watchlist <span className="text-sm font-normal text-muted-foreground">({titles.length} titles)</span>
                </h2>
            </div>

            <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <span>#</span>
                <span>Title</span>
                <span className="text-right">Group Avg</span>
                <span className="text-right">Your Status</span>
            </div>

            {titles.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                    No titles in this room yet.
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {titles.map((titlesSummary, index) => (
                        <RoomGroupWatchlistRow
                            key={String(titlesSummary.roomTitleId)}
                            title={titlesSummary}
                            index={index}
                            usersCache={mergedUsersCache}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};