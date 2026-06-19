import { useSyncUrl } from "~/shared/hooks";
import { FilterResponsiveWrapper } from "~/shared/ui/FilterResponsiveWrapper";
import { InfiniteScrollLoader } from "~/shared/ui/infinityScroll";
import {
  RoomCard,
  RoomCardWrapper,
  RoomFilters,
  useRoomFilterStore,
  useRoomsQuery,
} from "~/entities/room";
import { useMemo, useState } from "react";
import { AddNewButton } from "~/shared/ui/AddNewButton";
import { useNavigate } from "react-router";
import Modal from "~/shared/ui/Modal/Modal";

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
  const[isModalOpen, setIsModalOpen] = useState(false);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useRoomsQuery(userId ?? null);

  const allRooms = useMemo(() => {
    const flat = data?.pages.flatMap((page) => page.content) || [];
    return flat.filter(
      (r, i, arr) => arr.findIndex((x) => x.roomId === r.roomId) === i
    );
  }, [data]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-8 max-w-[1400px] mx-auto min-h-screen bg-background-muted/30">
      <FilterResponsiveWrapper pageTitle="My Rooms" filterTitle="Room Filters">
        <RoomFilters />
      </FilterResponsiveWrapper>
      
      <main className="flex-1">

        {isLoading ? (
          <div className="text-foreground">Loading rooms...</div> 
        ) : allRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AddNewButton onClick={() => {setIsModalOpen(true)}} placeholder="room" variant="card"/>
            {allRooms.map((room) => (
              <RoomCardWrapper key={room.roomId} room={room} onClick={() => navigate(`/rooms/${room.ownerId}/${room.roomId}`)}/> //temporary, should be decomposed
            ))}
          </div>
        ) : (
          <div className="text-foreground-muted text-center py-20"> 
            No rooms found.
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
      <Modal isOpen = {isModalOpen} onClose = {() => setIsModalOpen(false)}> coming soon </Modal>
    </div>
    
  );
}
