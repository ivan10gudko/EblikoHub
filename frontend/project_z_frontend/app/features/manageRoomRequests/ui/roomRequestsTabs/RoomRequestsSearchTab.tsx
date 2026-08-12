import { InfiniteScrollLoader } from "~/shared/ui/infinityScroll";
import { useRoomRequests } from "~/features/manageRoomRequests";
import { RoomSearchCard } from "~/entities/room/ui/roomCard/RoomSearchCard";
import { useRoomSearch, type RoomSearchResult } from "~/entities/room";

interface RoomRequestsSearchTabProps {
  searchQuery: string;
}

const RoomSearchItem = ({ room }: { room: RoomSearchResult }) => {
  const { joinRoom, isJoining } = useRoomRequests(room.roomId);

  return (
    <RoomSearchCard
      room={room}
      onJoin={joinRoom}
      isJoining={isJoining}
    />
  );
};

export const RoomRequestsSearchTab = ({
  searchQuery,
}: RoomRequestsSearchTabProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useRoomSearch(searchQuery);

  const searchResults = data?.pages.flatMap((p) => p.content) ?? [];

  if (!searchQuery.trim()) {
    return (
      <p className="text-center py-10 text-foreground-muted">
        Start typing to search for rooms...
      </p>
    );
  }

  if (isLoading && searchResults.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[240px] bg-background-muted/20 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  if (!isLoading && searchResults.length === 0) {
    return <p className="text-center py-10">No rooms found.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {searchResults.map((room) => (
          <RoomSearchItem key={room.roomId} room={room} />
        ))}
      </div>

      <InfiniteScrollLoader
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};