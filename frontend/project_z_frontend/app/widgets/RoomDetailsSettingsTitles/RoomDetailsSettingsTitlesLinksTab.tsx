import { useState, useCallback, useEffect } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { WatchlistShortTitles } from "./WatchlistShortTitles";
import { RoomTitleReadOnlyList } from "./RoomTitleList";
import { useRoomTitleLinkActions } from "~/features/manageRoomTitles";
import { ToggleSwitch } from "~/shared/ui/Switch";
import { MobileTitleLinksManager } from "./MobileRoomSettingsTitleLinksTab";
import { useWindowDimensions } from "~/shared/hooks";
import SearchBar from "~/shared/ui/SearchBar";

interface RoomDetailsSettingsTitlesLinksProps {
  userId: string;
  roomId: number;
}

export const RoomDetailsSettingsTitlesLinks = ({
  userId,
  roomId,
}: RoomDetailsSettingsTitlesLinksProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [watchlistSearchQuery, setWatchlistSearchQuery] = useState("");

  const [draggingTitleId, setDraggingTitleId] = useState<string | null>(null);
  const [isWatchlistModeToggleActive, setWatchlistModeToggleActive] = useState(false);
  const [pendingFetch, setPendingFetch] = useState(false);

  const breakpoint = useWindowDimensions();
  const isMobile = breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md";

  const { createLink } = useRoomTitleLinkActions(roomId);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    if (destination.droppableId.startsWith("room-title-")) {
      const targetRoomTitleId = destination.droppableId.replace("room-title-", "");
      createLink({
        titleId: Number(draggableId),
        roomTitleId: targetRoomTitleId,
      });
    }
  };

  if (isMobile) {
    return (
      <MobileTitleLinksManager
        userId={userId}
        roomId={roomId}
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
      <div className="grid grid-cols-2 gap-8 w-full p-0">
        <div className="flex flex-col gap-4 min-w-0">
          <div className="flex items-center justify-between gap-4 h-9">
            <h2 className="font-bold text-2xl whitespace-nowrap">My Watchlist</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-foreground">
                {isWatchlistModeToggleActive ? "Only titles with no links" : "All titles"}
              </span>
              <ToggleSwitch
                isActive={isWatchlistModeToggleActive}
                onToggle={setWatchlistModeToggleActive}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <SearchBar
              placeholder="Search watchlist..."
              onSearch={(query) => setWatchlistSearchQuery(query)}
              debounceMs={300}
              className="w-full"
              initialValue={watchlistSearchQuery}
            />
          </div>

          <WatchlistShortTitles
            userId={userId}
            roomId={roomId}
            isWatchlistModeToggled={isWatchlistModeToggleActive}
            searchQuery={watchlistSearchQuery}
          />
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          <div className="flex items-center justify-between gap-4 h-9">
            <h2 className="font-bold text-2xl whitespace-nowrap">Room Titles</h2>
          </div>

          <div className="flex justify-center">
            <SearchBar
              placeholder="Search room titles..."
              onSearch={(query) => setSearchQuery(query)}
              debounceMs={300}
              className="w-full"
            />
          </div>

          <RoomTitleReadOnlyList
            userId={userId}
            roomId={roomId}
            searchQuery={searchQuery}
            draggingTitleId={draggingTitleId ?? ""}
          />
        </div>
      </div>
    </DragDropContext>
  );
};