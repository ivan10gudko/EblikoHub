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
import { AddRoomCardButton } from "~/features/manageRoomSettings";
import { useNavigate } from "react-router";
import { RoomCardWrapper } from "~/widgets/RoomCard";
import { useIsInvitesExists } from "~/features/manageRoomRequests";
import { NotificationBadge } from "~/shared/ui/NotificationBadge";

export default function RoomsPage({ userId }: { userId: string | null }) {
  const { search, sortBy, order, setSearch, setSortFromUrl, setOrderFromUrl } =
    useRoomFilterStore();
  const filters = { search, sortBy, order };

  useSyncUrl(filters, {
    search: setSearch,
    sortBy: setSortFromUrl,
    order: setOrderFromUrl,
  });

  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useRoomsQuery(userId ?? null);

  const { data: hasInvites } = useIsInvitesExists();

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
            variant="secondaryCard"
            className="relative"
          >
            <span>My Requests</span>
            {hasInvites && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <NotificationBadge />
              </div>
            )}
          </Button>

          <Button
            onClick={() => navigate("add")}
            variant="secondaryCard"
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
    </div>
  );
}