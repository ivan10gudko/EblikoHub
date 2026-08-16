import { useSyncUrl } from "~/shared/hooks";
import { FilterResponsiveWrapper } from "~/shared/ui/FilterResponsiveWrapper";
import { InfiniteScrollLoader } from "~/shared/ui/infinityScroll";
import {
  RoomFilters,
  useRoomFilterStore,
  useRoomsQuery,
} from "~/entities/room";
import { useMemo } from "react";

import { Button } from "~/shared/ui/Button";
import { AddRoomCardButton, useRoomModal, GlobalModalManager } from "~/features/manageRoomSettings";
import { useNavigate } from "react-router";
import { RoomCardWrapper } from "~/widgets/RoomCard";

const secondaryBtnStyle =
  "w-full h-11 flex items-center justify-center gap-2 rounded-xl " +
  "bg-card hover:bg-background-muted " +
  "border border-border hover:border-primary " +
  "text-foreground hover:text-primary " +
  "font-bold text-sm tracking-wide " +
  "shadow-md hover:shadow-orange-glow " +
  "transition-all duration-200 " +
  "active:scale-[0.97] cursor-pointer";

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
    return data?.pages.flatMap((page) => page.content) ?? [];
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
        {isLoading ? (
          <div className="text-foreground">Loading rooms...</div>
        ) : isEmpty ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <AddRoomCardButton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allRooms.map((room) => (
              <RoomCardWrapper
                key={room.roomId}
                room={room}
              />
            ))}
          </div>
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