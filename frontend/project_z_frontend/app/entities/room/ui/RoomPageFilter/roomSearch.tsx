import SearchBar from "~/shared/ui/SearchBar";
import { useRoomFilterStore } from "../../store/rooms.store";

export const RoomSearch = () => {
  const { search, setSearch } = useRoomFilterStore();
  return (
    <div className="flex flex-col pt-2">

      <SearchBar
        key={search}
        onSearch={setSearch}
        className="w-full"
        initialValue={search}
      />
    </div>
  );
};
