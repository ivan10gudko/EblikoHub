
import { useMemo } from "react";
import { TitleFilters } from "~/features/titleFilter";
import { useTitlesQuery } from "~/features/titleFilter/hooks/useTitlesQuery";
import { useTitleFilterStore } from "~/features/titleFilter/store/titleFilter.store";
import { useSyncUrl } from "~/shared/hooks";
import { queryClient } from "~/shared/lib";
import { InfiniteScrollLoader } from "~/shared/ui/infinityScroll";
import { WatchlistTable } from "~/widgets/WatchListTable";

export const WatchListPage = ({ userId }: { userId: string | null }) => {

  const {
    search, sortBy, order, status,
    setSearch,
    setSortFromUrl,
    setStatusFromUrl,
    setOrderFromUrl
  } = useTitleFilterStore();

  const filters = { search, sortBy, order, status };

  useSyncUrl(filters, {
    search: setSearch,
    sortBy: setSortFromUrl,
    status: setStatusFromUrl,
    order: setOrderFromUrl
  });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useTitlesQuery(userId);

  const allTitles = useMemo(() =>
    data?.pages.flatMap(page => page.content) || [],
    [data]
  );

  return (
    <div className="flex gap-6 p-6 max-w-[1400px] mx-auto min-h-screen">
      <aside className="w-64">
        <TitleFilters />
      </aside>

      <main className="flex-1 flex flex-col gap-4">
        <WatchlistTable
          titles={allTitles}
          isLoading={isLoading}

        />


        <InfiniteScrollLoader
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </main>
    </div>
  );
};