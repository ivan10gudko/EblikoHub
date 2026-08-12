import { useSyncUrl } from "~/shared/hooks";
import { FilterResponsiveWrapper } from "~/shared/ui/FilterResponsiveWrapper";
import { InfiniteScrollLoader } from "~/shared/ui/infinityScroll";
import {
  RoomFilters,
  RoomListGrid,
  useRoomFilterStore,
  useRoomsQuery,
} from "~/entities/room";
import { useMemo } from "react";

import { Button } from "~/shared/ui/Button";
import { AddRoomCardButton, useRoomModal, GlobalModalManager, useRoomActions } from "~/features/manageRoomSettings";
import { useNavigate } from "react-router";

import PushPinIcon from "@mui/icons-material/PushPin";
import type { RoomShort } from "~/entities/room/model/room.types";
import { RoomActionsMenu } from "~/features/manageRoomSettings/ui/RoomActionsMenu";

const secondaryBtnStyle =
  "w-full h-11 flex items-center justify-center gap-2 rounded-xl " +
  "bg-card hover:bg-background-muted " +
  "border border-border hover:border-primary " +
  "text-foreground hover:text-primary " +
  "font-bold text-sm tracking-wide " +
  "shadow-md hover:shadow-orange-glow " +
  "transition-all duration-200 " +
  "active:scale-[0.97] cursor-pointer";

const RoomListItem = ({ room }: { room: RoomShort }) => {
  const { pinRoom, unpinRoom, isPending } = useRoomActions(room.roomId);

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (room.isPinned) {
      unpinRoom();
    } else {
      pinRoom();
    }
  };

  return (
    <>
      <button
        onClick={handleTogglePin}
        disabled={isPending}
        className="flex items-center justify-center p-1 rounded-lg hover:bg-background-muted transition-colors cursor-pointer"
      >
        <PushPinIcon className={`text-sm ${room.isPinned ? "text-primary" : "text-foreground"}`} />
      </button>

      <RoomActionsMenu room={room} />
    </>
  );
};

export default function RoomsPage({ userId }: { userId: string | null }) {
  const { search, sortBy, order, setSearch, setSortFromUrl, setOrderFromUrl } =
    useRoomFilterStore();
  const filters = { search, sortBy, order };

  useSyncUrl(filters, {
    search: setSearch,
    sortBy: setSortFromUrl,
    order: setOrderFromUrl,
  });

  const { openRoomModal } = useRoomModal();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useRoomsQuery(userId ?? null);
  const navigate = useNavigate();

  const allRooms = useMemo(() => {
    const flat = data?.pages.flatMap((page) => page.content) || [];
    return flat.filter(
      (r, i, arr) => arr.findIndex((x) => x.roomId === r.roomId) === i
    );
  }, [data]);

  const isEmpty = !isLoading && allRooms.length === 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-8 max-w-[1400px] mx-auto min-h-screen bg-background-muted/30">
      <FilterResponsiveWrapper pageTitle="My Rooms">
        <RoomFilters>
          <Button
            onClick={() => navigate("/rooms/requests")}
            className={secondaryBtnStyle}
          >
            My Requests
          </Button>
          <Button
            onClick={() => openRoomModal("add")}
            className={secondaryBtnStyle}
          >
            <span className="text-2xl font-extrabold leading-none relative -top-[1px] select-none">
              +
            </span>
            <span>Add New Room</span>
          </Button>
        </RoomFilters>
      </FilterResponsiveWrapper>

      <main className="flex-1">
        {isEmpty ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <AddRoomCardButton />
          </div>
        ) : (
          <RoomListGrid
            rooms={allRooms}
            isLoading={isLoading}
            isEmpty={allRooms.length === 0}
            renderActions={(room) => <RoomListItem room={room} />}
          />
        )}

        <div className="py-10 flex justify-center">
          <InfiniteScrollLoader
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>
      </main>
      <GlobalModalManager />
    </div>
  );
}