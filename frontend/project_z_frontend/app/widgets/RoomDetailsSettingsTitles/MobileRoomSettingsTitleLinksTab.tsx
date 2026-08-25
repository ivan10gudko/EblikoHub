import { WatchlistShortTitles } from "./WatchlistShortTitles";
import { RoomTitleReadOnlyList } from "./RoomTitleList";
import { ToggleSwitch } from "~/shared/ui/Switch";
import { TitleFiltersDropdown } from "~/features/titleFilter";
import type { RoomTitleWithUserLinks } from "~/features/manageRoomTitles";
import { useState } from "react";

interface MobileTitleLinksManagerProps {
  userId: string;
  roomId: number;
  titles: RoomTitleWithUserLinks[];
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
  onCreateLink,
}: MobileTitleLinksManagerProps) => {
  const [activeTab, setActiveTab] = useState<"watchlist" | "rooms">("watchlist");
  const [selectedTitleId, setSelectedTitleId] = useState<number | null>(null);
  const [isWatchlistModeToggleActive, setWatchlistModeToggleActive] = useState(false);

  const handleSelectTitle = (id: number) => {
    setSelectedTitleId(id);
    setActiveTab("rooms");
  };

  const handleSelectRoom = (roomTitleId: string) => {
    if (!selectedTitleId) return;

    const targetRoomTitle = titles.find(
      (t) => String(t.id) === String(roomTitleId)
    );

    if (targetRoomTitle?.links && targetRoomTitle.links.length > 0) {
      return;
    }

    onCreateLink({ titleId: selectedTitleId, roomTitleId });
    setSelectedTitleId(null);
  };

  return (
    <div className="flex flex-col gap-5 -mx-4 w-[calc(100%+2rem)] px-4">
      <div className="flex w-full bg-card border border-border p-1.5 rounded-xl gap-2 shadow-md">
        <button
          type="button"
          onClick={() => setActiveTab("watchlist")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === "watchlist"
              ? "bg-primary/10 text-primary border border-primary/30 shadow-inner"
              : "text-foreground/60 border border-transparent"
            }`}
        >
          My Watchlist {selectedTitleId && "•"}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rooms")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === "rooms"
              ? "bg-primary/10 text-primary border border-primary/30 shadow-inner"
              : "text-foreground/60 border border-transparent"
            }`}
        >
          Room Titles
        </button>
      </div>

      {selectedTitleId && activeTab === "rooms" && (
        <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-xl p-3 text-xs font-bold text-foreground">
          <span>Title selected! Now tap a Room card to link.</span>
          <button
            onClick={() => setSelectedTitleId(null)}
            className="underline text-[10px] opacity-80 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {activeTab === "watchlist" && (
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-primary font-semibold">Tap a title to choose it</p>
            <div className="flex flex-row items-center gap-3">
              <span className="text-xs text-foreground">
                {isWatchlistModeToggleActive ? "No links" : "All"}
              </span>
              <ToggleSwitch
                isActive={isWatchlistModeToggleActive}
                onToggle={setWatchlistModeToggleActive}
              />
              <TitleFiltersDropdown />
            </div>
          </div>

          <WatchlistShortTitles
            userId={userId}
            roomId={roomId}
            isWatchlistModeToggled={isWatchlistModeToggleActive}
            isMobile={true}
            onSelectMobileTitle={handleSelectTitle}
          />
        </div>
      )}

      {activeTab === "rooms" && (
        <div className="flex flex-col gap-4 w-full">
          <RoomTitleReadOnlyList
            draggingTitleId={selectedTitleId ? String(selectedTitleId) : ""}
            titles={titles}
            isLoading={isLoading}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isMobile={true}
            onSelectMobileRoom={handleSelectRoom}
          />
        </div>
      )}
    </div>
  );
};