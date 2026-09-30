import { useState } from "react";
import { WatchlistShortTitles } from "./WatchlistShortTitles";
import { RoomTitleReadOnlyList } from "./RoomTitleList";
import { ToggleSwitch } from "~/shared/ui/Switch";
import SearchBar from "~/shared/ui/SearchBar";

interface MobileTitleLinksManagerProps {
  userId: string;
  roomId: number;
  onCreateLink: (payload: { titleId: number; roomTitleId: string }) => void;
}

export const MobileTitleLinksManager = ({
  userId,
  roomId,
  onCreateLink,
}: MobileTitleLinksManagerProps) => {
  const [activeTab, setActiveTab] = useState<"watchlist" | "rooms">("watchlist");
  const [selectedTitleId, setSelectedTitleId] = useState<number | null>(null);
  const [isWatchlistModeToggleActive, setWatchlistModeToggleActive] = useState(false);
  const [watchlistSearchQuery, setWatchlistSearchQuery] = useState("");
  const [roomSearchQuery, setRoomSearchQuery] = useState("");

  const handleSelectTitle = (id: number) => {
    setSelectedTitleId(id);
    setActiveTab("rooms");
  };

  const handleSelectRoom = (roomTitleId: string) => {
    if (!selectedTitleId) return;

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
            </div>
          </div>

          <SearchBar
            placeholder="Search watchlist..."
            onSearch={(query) => setWatchlistSearchQuery(query)}
            debounceMs={300}
            className="w-full"
            initialValue={watchlistSearchQuery}
          />

          <WatchlistShortTitles
            userId={userId}
            roomId={roomId}
            isWatchlistModeToggled={isWatchlistModeToggleActive}
            searchQuery={watchlistSearchQuery}
            isMobile={true}
            onSelectMobileTitle={handleSelectTitle}
          />
        </div>
      )}

      {activeTab === "rooms" && (
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-lg whitespace-nowrap">Room Titles</h3>
          </div>

          <SearchBar
            placeholder="Search rooms..."
            onSearch={(query) => setRoomSearchQuery(query)}
            debounceMs={300}
            className="w-full"
            initialValue={roomSearchQuery}
          />

          <RoomTitleReadOnlyList
            userId={userId}
            roomId={roomId}
            searchQuery={roomSearchQuery}
            draggingTitleId={selectedTitleId ? String(selectedTitleId) : ""}
            isMobile={true}
            onSelectMobileRoom={handleSelectRoom}
          />
        </div>
      )}
    </div>
  );
};