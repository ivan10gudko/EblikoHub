import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { WatchlistShortTitles } from "./WatchlistShortTitles";
import { RoomTitleReadOnlyList } from "./RoomTitleList";
import { useInfiniteRoomTitlesWithLinks, useRoomTitleLinkActions } from "~/features/manageRooms";
import { useState, useEffect } from "react";
import { ToggleSwitch } from "~/shared/ui/Switch";
import { MobileTitleLinksManager } from "./MobileRoomSettsngsTitleLinksTab";


export const RoomDetailsSettingsTitlesLinks = ({ userId, roomId }: { userId: string, roomId: number }) => {
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteRoomTitlesWithLinks(roomId, userId, { page: 0, limit: 20 });
    
    const [draggingTitleId, setDraggingTitleId] = useState<string | null>(null);
    const [isWatchlistModeToggleActive, setWatchlistModeToggleActive] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const allTitles = data?.pages.flatMap(page => page.content) ?? [];
    const { createLink } = useRoomTitleLinkActions(Number(roomId));

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;
        if (!destination || destination.droppableId === source.droppableId) return;

        if (destination.droppableId.startsWith("room-title-")) {
            const targetRoomTitleId = destination.droppableId.replace("room-title-", "");
            createLink({
                titleId: Number(draggableId),
                roomTitleId: targetRoomTitleId
            });
        }
    };

    
    if (isMobile) {
        return (
            <MobileTitleLinksManager
                userId={userId}
                roomId={roomId}
                titles={allTitles}
                isLoading={isLoading}
                fetchNextPage={fetchNextPage}
                hasNextPage={!!hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                onCreateLink={createLink}
            />
        );
    }

    
    return (
        <DragDropContext
            onDragStart={(start) => setDraggingTitleId(start.draggableId)}
            onDragEnd={(result) => {
                setDraggingTitleId(null);
                onDragEnd(result);
            }}
        >
            <div className="grid grid-cols-2 gap-8 w-full p-4">
                <div className="flex flex-col gap-4 min-w-0">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-lg">My Watchlist</h2>
                        <div className="flex flex-row items-center gap-3">
                            <span className="text-xs text-foreground">
                                {isWatchlistModeToggleActive ? "Only titles with no links" : "All titles"}
                            </span>
                            <ToggleSwitch
                                isActive={isWatchlistModeToggleActive}
                                onToggle={setWatchlistModeToggleActive}
                            />
                        </div>
                    </div>
                    <WatchlistShortTitles userId={userId} roomId={roomId} isWatchlistModeToggled={isWatchlistModeToggleActive} />
                </div>

                <div className="flex flex-col gap-4 min-w-0">
                    <h2 className="font-bold text-lg">Room Titles</h2>
                    <RoomTitleReadOnlyList
                        draggingTitleId={draggingTitleId!}
                        titles={allTitles}
                        isLoading={isLoading}
                        fetchNextPage={fetchNextPage}
                        hasNextPage={!!hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                </div>
            </div>
        </DragDropContext>
    );
};