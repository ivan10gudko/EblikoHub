import SearchBar from "~/shared/ui/SearchBar";

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

const SearchFilter = ({ searchQuery, setSearchQuery }: SearchFilterProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-foreground uppercase px-1">
        
      </label>
      <SearchBar
        key={searchQuery}
        onSearch={setSearchQuery}
        className="w-full"
        initialValue={searchQuery}
      />
    </div>
  );
};
export default SearchFilter;
