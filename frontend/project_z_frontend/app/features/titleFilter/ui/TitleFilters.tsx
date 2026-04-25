
import { useTitleFilterStore, type TitleSortType } from "../store/titleFilter.store";
import { Button } from "~/shared/ui/Button";
import SortControl from "./SortControl";
import StatusFilter from "./StatusFilter";
import SearchFilter from "./SearchFilter";
import {Divider } from '@mui/material';
export const TitleFilters = () => {
  const { 
    search, setSearch, 
    reset 
  } = useTitleFilterStore();

return (
    <div className="flex flex-col gap-10 p-4 bg-background rounded-2xl shadow-sm border border-border">
      <SearchFilter
          searchQuery={search}
          setSearchQuery={setSearch}
      />
      
      <SortControl />
      
      <StatusFilter />

      <Divider sx ={{my : 1}}/>
        <Button 
          onClick={reset}
          variant="outline"
          className="text-sm hover:bg-background-muted hover:text-danger-hover transition-colors font-medium p-0 h-auto"
        >
          Reset all filters
        </Button>
      
    </div>
  );
};
      

     
