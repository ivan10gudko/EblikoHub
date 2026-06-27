
import { useState } from "react";
import SearchBar from "~/shared/ui/SearchBar";
import { useDebouncedCallback } from "~/shared/hooks/useDebouncedCallback";
import { RoomRequestsSearchTab } from "~/entities/room/ui/roomRequestsTabs/RoomRequestsSearchTab";

export default function RoomRequestsSearchPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [displayQuery, setDisplayQuery] = useState("");

    const [debouncedSearch] = useDebouncedCallback((query: string) => {
        setDisplayQuery(query);
    }, 400);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        debouncedSearch(value);
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            <SearchBar
                onChange={handleSearchChange}
                onSearch={handleSearchChange}
                className="bg-background-muted/40"
                placeholder="Search for rooms..."
            />
            <RoomRequestsSearchTab searchQuery={displayQuery} />
        </div>
    );
}