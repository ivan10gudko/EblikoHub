import { useSyncUrl } from "~/shared/hooks";
import { FilterResponsiveWrapper } from "~/shared/ui/FilterResponsiveWrapper";
import { InfiniteScrollLoader } from "~/shared/ui/infinityScroll";
import {
  RoomFilters,
  RoomListGrid,
  useRoomFilterStore,
  useRoomsQuery,
} from "~/entities/room";
import { useMemo, useState } from "react";

import { Button } from "~/shared/ui/Button";
import { RoomModalManager } from "~/features/manageRooms";
import { useRoomModal } from "~/features/manageRooms/hooks/useRoomModal";
import { NavLink, useNavigate } from "react-router";


export default function RoomsPage({ userId }: { userId: string | null }) {
  const { search, sortBy, order, setSearch, setSortFromUrl, setOrderFromUrl } =
    useRoomFilterStore();
  const filters = { search, sortBy, order };

  useSyncUrl(filters, {
    search: setSearch,
    sortBy: setSortFromUrl,
    order: setOrderFromUrl,
  });
  const { open } = useRoomModal();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useRoomsQuery(userId ?? null);
  const navigate = useNavigate();
  const allRooms = useMemo(() => {
    const flat = data?.pages.flatMap((page) => page.content) || [];
    return flat.filter(
      (r, i, arr) => arr.findIndex((x) => x.roomId === r.roomId) === i
    );
  }, [data]);

  const handleOpenAdd = () => {
    open('add', '1');
  };
  const actionButtonsStyles = "w-full flex items-center justify-center gap-2 bg-primary text-foreground py-3 rounded-xl";
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-8 max-w-[1400px] mx-auto min-h-screen bg-background-muted/30">
      <FilterResponsiveWrapper
        pageTitle="My Rooms"
        actionButtons={[
          <Button
            onClick={() => navigate("/rooms/requests")}
            className={actionButtonsStyles}>
            My Requests
          </Button>,
          <Button
            onClick={handleOpenAdd}
            className={actionButtonsStyles}
          >
            <span>Add New Room</span>
          </Button>

        ]}
      >
        <RoomFilters />
      </FilterResponsiveWrapper>

      <main className="flex-1">
        <RoomListGrid
          rooms={allRooms}
          isLoading={isLoading}
          isEmpty={allRooms.length === 0}
        />
        <div className="py-10 flex justify-center">
          <InfiniteScrollLoader
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </div>
      </main>
      <RoomModalManager />
    </div>

  );
}
