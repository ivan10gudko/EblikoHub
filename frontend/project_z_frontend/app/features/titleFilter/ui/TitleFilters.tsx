import { useTitleFilterStore } from "../store/titleFilter.store";
import { Button } from "~/shared/ui/Button";
import SortControl from "./SortControl";
import StatusFilter from "./StatusFilter";
import SearchFilter from "./SearchFilter";
import TypeFilter from "./TitleTypeFilter";

interface TitleFiltersProps {
  statusCount?: Record<string, number>;
  typeCount?: Record<string, number>;
  compact?: boolean;
}

export const TitleFilters = ({
  statusCount,
  typeCount,
  compact = false,
}: TitleFiltersProps) => {
  const { search, setSearch, reset } = useTitleFilterStore();

  return (
    <div
      className={`flex flex-col gap-6 ${
        compact
          ? "p-0 bg-transparent border-0 max-h-[70vh] overflow-y-auto hide-scrollbar pr-1"
          : "p-4 bg-background/40 rounded-2xl shadow-sm border border-border max-h-[calc(100vh-106px)] sm:max-h-[calc(100vh-130px)] overflow-y-auto pb-6 hide-scrollbar"
      }`}
    >
      <SearchFilter searchQuery={search} setSearchQuery={setSearch} />

      <SortControl />

      <StatusFilter statusCount={statusCount} />

      <div className="flex flex-col gap-6">
        <TypeFilter typeCount={typeCount} />

        <Button
          onClick={reset}
          variant="resetFilters"
          className="py-3 mt-1 w-full"
        >
          Reset all filters
        </Button>
      </div>
    </div>
  );
};