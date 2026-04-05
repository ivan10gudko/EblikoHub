import { useMemo } from "react";
import { TitleFilters } from "~/features/titleFilter";
import { useTitlesQuery } from "~/features/titleFilter/hooks/useTitlesQuery";
import { useTitleFilterStore } from "~/features/titleFilter/store/titleFilter.store";
import { useSyncUrl } from "~/shared/hooks";
import { Sidebar } from "~/shared/ui/Sidebar";

const RoomPage = ()=> {
    const { 
    search, sortBy, status, order,
    setSearch, setSortFromUrl, setStatusFromUrl, setOrderFromUrl
} = useTitleFilterStore();

const config = useMemo(() => ({
    search: setSearch,
    sortBy: setSortFromUrl,
    status: setStatusFromUrl,
    order: setOrderFromUrl
}), [setSearch, setSortFromUrl, setStatusFromUrl, setOrderFromUrl]);
const { data: titles, isLoading, isError } = useTitlesQuery();
useSyncUrl({ search, sortBy, status, order }, config);
    return (
        <div className="flex w-full my-8 mx-16 h-full min-h-[calc(100vh-64px)]">
        <Sidebar className="h-fit">
        <TitleFilters />
        </Sidebar>
        </div>
    );
}

export default RoomPage;