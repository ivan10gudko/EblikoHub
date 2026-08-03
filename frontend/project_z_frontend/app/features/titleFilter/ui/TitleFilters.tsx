import { useTitleFilterStore } from "../store/titleFilter.store";
import { Button } from "~/shared/ui/Button";
import SortControl from "./SortControl";
import StatusFilter from "./StatusFilter";
import SearchFilter from "./SearchFilter";
import TypeFilter from "./TitleTypeFilter";

interface TitleFiltersProps {
  statusCount?: Record<string, number>;
  typeCount?: Record<string, number>;
}

export const TitleFilters = ({ statusCount, typeCount }: TitleFiltersProps) => {
  const { search, setSearch, reset } = useTitleFilterStore();

  return (
    <div className="flex flex-col gap-6 p-4 bg-background rounded-2xl shadow-sm border border-border max-h-[calc(100vh-140px)] overflow-y-auto pb-6 hide-scrollbar">
      <SearchFilter searchQuery={search} setSearchQuery={setSearch} />

      <SortControl />

      <StatusFilter statusCount={statusCount} />

      
      <div className="flex flex-col gap-6">
        <TypeFilter typeCount={typeCount} />

        <Button
          onClick={reset}
          variant="resetFilters"
          className="py-3 mt-1"
        >
          Reset all filters
        </Button>
      </div>
    </div>
  );
};