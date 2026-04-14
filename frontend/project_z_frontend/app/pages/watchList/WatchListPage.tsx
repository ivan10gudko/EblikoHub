import { useMemo } from "react";
import { TitleFilters } from "~/features/titleFilter";
import { useTitlesQuery } from "~/features/titleFilter/hooks/useTitlesQuery";
import { useTitleFilterStore } from "~/features/titleFilter/store/titleFilter.store";
import { FilterResponsiveWrapper } from "~/features/titleFilter/ui/FilterWrapper";
import { useSyncUrl } from "~/shared/hooks";
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
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-8 max-w-[1400px] mx-auto min-h-screen bg-gray-50/30">

      <FilterResponsiveWrapper>
        <TitleFilters />
      </FilterResponsiveWrapper>

      <main className="flex-1 flex flex-col gap-4">
        <WatchlistTable titles={allTitles} isLoading={isLoading} />

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
};