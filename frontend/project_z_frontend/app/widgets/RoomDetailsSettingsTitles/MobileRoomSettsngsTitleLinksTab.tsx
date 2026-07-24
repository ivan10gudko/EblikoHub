import { DragDropContext } from "@hello-pangea/dnd";
import { useState } from "react";
import { WatchlistShortTitles } from "./WatchlistShortTitles";
import { RoomTitleReadOnlyList } from "./RoomTitleList";
import { ToggleSwitch } from "~/shared/ui/Switch";

interface MobileTitleLinksManagerProps {
    userId: string;
    roomId: number;
    titles: any[];
    isLoading: boolean;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    onCreateLink: (payload: { titleId: number; roomTitleId: string }) => void;
}

export const MobileTitleLinksManager = ({
    userId,
    roomId,
    titles,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onCreateLink
}: MobileTitleLinksManagerProps) => {
    const [activeTab, setActiveTab] = useState<"watchlist" | "rooms">("watchlist");
    const [selectedTitleId, setSelectedTitleId] = useState<number | null>(null);
    const [isWatchlistModeToggleActive, setWatchlistModeToggleActive] = useState(false);

    const handleMobileLink = (roomTitleId: string) => {
        if (!selectedTitleId) return;
        
      
        const targetRoomTitle = titles.find(t => String(t.roomTitleId) === String(roomTitleId));
        
        
        if (targetRoomTitle?.titleId) {
            return; 
        }

        onCreateLink({ titleId: selectedTitleId, roomTitleId });
        setSelectedTitleId(null);
    };

    return (
        <DragDropContext onDragEnd={() => {}}>
            <div 
                onClick={(e) => {
                    const target = e.target as HTMLElement;

                    if (target.closest('button') || target.closest('svg') || target.closest('[role="button"]')) {
                        return;
                    }

                   
                    const watchlistCard = target.closest('[data-rfd-draggable-id], [data-draggable-id]');
                    if (watchlistCard && activeTab === "watchlist") {
                        const id = watchlistCard.getAttribute('data-rfd-draggable-id') || watchlistCard.getAttribute('data-draggable-id');
                        if (id) {
                            setSelectedTitleId(Number(id));
                            setActiveTab("rooms");
                            return;
                        }
                    }

                  
                    const roomZone = target.closest('[data-rfd-droppable-id], [data-droppable-id]');
                    if (roomZone && activeTab === "rooms" && selectedTitleId) {
                        const dropId = roomZone.getAttribute('data-rfd-droppable-id') || roomZone.getAttribute('data-droppable-id');
                        if (dropId && dropId.startsWith("room-title-")) {
                            handleMobileLink(dropId.replace("room-title-", ""));
                        }
                    }
                }}
                className="flex flex-col gap-5 -mx-4 w-[calc(100%+2rem)] px-4 [&_[data-rfd-drag-handle-context-id]]:hidden [&_[data-rfd-drag-handle-context-id]]:pointer-events-none [&_[data-rfd-draggable-id]]:w-full [&_li]:w-full [&_li>div]:gap-x-2 [&_li_img]:ml-0 [&_[data-rfd-draggable-id]]:!mb-1.5 [&_[data-draggable-id]]:!mb-1.5 [&_[data-rfd-draggable-id]]:last:!mb-0 [&_[data-draggable-id]]:last:!mb-0"
            >
               
                <div className="flex w-full bg-card border border-border p-1.5 rounded-xl gap-2 shadow-md">
                    <button
                        type="button"
                        onClick={() => setActiveTab("watchlist")}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all active:scale-[0.98] cursor-pointer ${
                            activeTab === "watchlist" 
                                ? "bg-primary/10 text-primary border border-primary/30 shadow-inner" 
                                : "text-foreground/60 border border-transparent hover:text-foreground"
                        }`}
                    >
                        My Watchlist {selectedTitleId && "•"}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => setActiveTab("rooms")}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all active:scale-[0.98] cursor-pointer ${
                            activeTab === "rooms" 
                                ? "bg-primary/10 text-primary border border-primary/30 shadow-inner" 
                                : "text-foreground/60 border border-transparent hover:text-foreground"
                        }`}
                    >
                        Room Titles
                    </button>
                </div>

                
                {selectedTitleId && activeTab === "rooms" && (
                    <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-xl p-3 text-xs font-bold text-foreground animate-fade-in">
                        <span>🎯 Title selected! Now tap a Room card to link.</span>
                        <button 
                            onClick={() => setSelectedTitleId(null)} 
                            className="underline text-[10px] opacity-80 cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                )}

               
                {activeTab === "watchlist" && (
                    <div className="flex flex-col gap-4 w-full animate-in fade-in duration-200">
                        <div className="flex items-center justify-between px-1">
                            <p className="text-xs text-primary font-semibold">👉 Tap a title to choose it</p>
                            <div className="flex flex-row items-center gap-3">
                                <span className="text-xs text-foreground">
                                    {isWatchlistModeToggleActive ? "No links" : "All"}
                                </span>
                                <ToggleSwitch
                                    isActive={isWatchlistModeToggleActive}
                                    onToggle={setWatchlistModeToggleActive}
                                />
                            </div>
                        </div>
                        <div className="-mx-2 w-[calc(100%+1rem)]">
                            <WatchlistShortTitles userId={userId} roomId={roomId} isWatchlistModeToggled={isWatchlistModeToggleActive} />
                        </div>
                    </div>
                )}

                
{activeTab === "rooms" && (
    <div className="flex flex-col gap-4 w-full animate-in fade-in duration-200">
        <div className="-mx-2 w-[calc(100%+1rem)]">
            <RoomTitleReadOnlyList
               
                draggingTitleId={selectedTitleId ? String(selectedTitleId) : (null as any)}
                titles={titles}
                isLoading={isLoading}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
            />
        </div>
    </div>
)}
            </div>
        </DragDropContext>
    );
};