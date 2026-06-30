import { useState } from "react";
import SearchBar from "~/shared/ui/SearchBar";
import { useDebounce } from "~/shared/hooks";
import { RoomRequestsSearchTab } from "~/entities/room";

export default function RoomRequestsSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const displayQuery = useDebounce(searchQuery, 400);

  return (
    <div className="flex flex-col gap-6 p-6">
      <SearchBar
        onChange={setSearchQuery}
        onSearch={setSearchQuery}
        className="bg-background-muted/40"
        placeholder="Search for rooms..."
      />
      <RoomRequestsSearchTab searchQuery={displayQuery} />
    </div>
  );
}
