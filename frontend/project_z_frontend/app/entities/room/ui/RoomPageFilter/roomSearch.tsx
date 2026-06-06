import { SearchBar } from "~/features/search";
import { useRoomFilterStore } from "../../store/rooms.store";


export const RoomSearch = () => {
    const { search, setSearch } = useRoomFilterStore();
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground-muted uppercase px-1">
                Search
            </label>
            <SearchBar
                key={search}
                onSearch={setSearch}
                className="w-full"
                initialValue={search}
            />
        </div>
    );
};