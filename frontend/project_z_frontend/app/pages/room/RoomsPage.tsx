import { useMemo } from "react";
import { useAuthStore } from "~/features/auth";
import { RoomFilters } from "~/entities/room/ui/RoomPageFilter/roomFilter";
import { useRoomsQuery } from "~/entities/room/hooks/useRoomsQuery";
import { useSyncUrl } from "~/shared/hooks";
import { FilterResponsiveWrapper } from "~/shared/ui/FilterResponsiveWrapper";
import { InfiniteScrollLoader } from "~/shared/ui/infinityScroll";
import { useRoomFilterStore } from "~/entities/room/store/rooms.store";

export default function RoomsPage({ userId }: { userId: string | null }) {


    const {
        search, sortBy, order,
        setSearch, setSortFromUrl, setOrderFromUrl
    } = useRoomFilterStore();

    const filters = { search, sortBy, order };

    useSyncUrl(filters, {
        search: setSearch,
        sortBy: setSortFromUrl,
        order: setOrderFromUrl,
    });


    const {
        data, fetchNextPage, hasNextPage,
        isFetchingNextPage, isLoading
    } = useRoomsQuery(userId ?? null);


    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-8 max-w-[1400px] mx-auto min-h-screen bg-background-muted/30">
            <FilterResponsiveWrapper
                pageTitle="My Rooms"
                filterTitle="Room Filters"
            >
                <RoomFilters />
            </FilterResponsiveWrapper>
            <main>
                <p className="text-xl text-primary" >Coming Soon</p>
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