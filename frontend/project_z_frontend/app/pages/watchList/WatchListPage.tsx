
import { useMemo } from "react";
import { TitleFilters } from "~/features/titleFilter";
import { useTitlesQuery } from "~/features/titleFilter/hooks/useTitlesQuery";
import { useTitleFilterStore } from "~/features/titleFilter/store/titleFilter.store";
import { useSyncUrl } from "~/shared/hooks";
import { queryClient } from "~/shared/lib";
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
    search: setSearch, // тут помилки нема, бо search — це і так string
    sortBy: setSortFromUrl, // використовуємо метод з валідацією
    status: setStatusFromUrl, // використовуємо метод з валідацією
    order: setOrderFromUrl // додаємо і сортування для повної синхронізації
  });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useTitlesQuery(userId);

  const allTitles = useMemo(() => 
    data?.pages.flatMap(page => page.content) || [], 
    [data]
  );

  // Тимчасова заглушка для оновлення (потім сюди прикрутиш мутацію)
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
        
        {hasNextPage && (
          <button 
            onClick={() => fetchNextPage()} 
            disabled={isFetchingNextPage}
            className="py-2 text-amber-500 font-bold hover:bg-amber-50 rounded-lg"
          >
            {isFetchingNextPage ? "Завантаження..." : "Показати ще"}
          </button>
        )}
      </main>
    </div>
  );
};