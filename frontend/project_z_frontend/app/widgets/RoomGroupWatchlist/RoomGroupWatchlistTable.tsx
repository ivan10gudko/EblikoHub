import { RoomGroupWatchlistSkeleton } from "./RoomGroupWatchlistSkeleton";
import type { useRoomTitlesQuery } from "../RoomDetailsManager";
import { mergePagedCache } from "~/shared/helpers/mergePagedCache";
import { RoomGroupWatchlistRow } from "./RoomGroupWatchlistRow";
import { InfiniteScrollLoader } from "~/shared/ui/infinityScroll";
import { useRoomWatchlistVisualStore } from "./store/useRoomTitleVisual.store";
import { ToggleSwitch } from "~/shared/ui/Switch";

interface RoomGroupWatchlistTableProps {
    titlesData: ReturnType<typeof useRoomTitlesQuery>["data"];
    isLoading: boolean;
    hasNextPage?: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    isMember: boolean;
}

export const RoomGroupWatchlistTable = ({
    titlesData,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isMember,
}: RoomGroupWatchlistTableProps) => {
    const titles = titlesData?.pages.flatMap((page) => page.content ?? []) ?? [];
    const mergedUsersCache = mergePagedCache(titlesData?.pages, (page) => page.usersCache);

    const { showMyVisual, toggleVisual } = useRoomWatchlistVisualStore();

    if (isLoading) return <RoomGroupWatchlistSkeleton />;

    return (
        <div className="bg-card border border-border rounded-2xl p-3 md:p-4 w-full flex flex-col gap-4 box-border overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border">
                <h2 className="text-base md:text-lg font-bold text-foreground">
                    Group Watchlist <span className="text-xs md:text-sm font-normal text-muted-foreground">({titles.length} titles)</span>
                </h2>

                {isMember && (
                    <div className="flex items-center justify-between sm:justify-start gap-2 bg-background-muted/40 sm:bg-transparent p-2 sm:p-0 rounded-xl border sm:border-none border-border/60">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Personalized View
                        </span>
                        <ToggleSwitch isActive={showMyVisual} onToggle={toggleVisual} />
                    </div>
                )}
            </div>

            <div className="hidden sm:grid grid-cols-[auto_1fr_100px_85px] items-center gap-x-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <span>#</span>
                <span>Title</span>
                <span className="text-center">Status</span>
                <span className="text-right whitespace-nowrap pr-12">Avg</span>
            </div>

            {titles.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No titles in this room yet.</div>
            ) : (
                <div className="flex flex-col gap-2 w-full">
                    {titles.map((titleSummary, index) => (
                        <RoomGroupWatchlistRow
                            key={String(titleSummary.roomTitleId)}
                            title={titleSummary}
                            index={index}
                            usersCache={mergedUsersCache}
                            showMyVisual={showMyVisual}
                            isMember={isMember}
                        />
                    ))}
                    <InfiniteScrollLoader
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                    />
                </div>
            )}
        </div>
    );
};