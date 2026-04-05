import { SearchBar } from "~/features/search";

interface SearchFilterProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
}

const SearchFilter = ({ searchQuery, setSearchQuery }: SearchFilterProps) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-500 uppercase px-1">
                Search
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