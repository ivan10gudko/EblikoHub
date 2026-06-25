import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { AddFriendTab } from "~/features/manageFriends/ui/FriendsTabs/AddFriendTab";
import SearchBar from "~/shared/ui/SearchBar";
import { useFriends } from "~/features/manageFriends/hooks/useFriends";
import { useDebouncedCallback } from "~/shared/hooks/useDebouncedCallback";

export default function AddFriendPage() {
  const { userId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [displayQuery, setDisplayQuery] = useState("");

  const { isPendingGlobal, handleFriendAction } = useFriends(userId!, "add");


  const [debouncedSearch] = useDebouncedCallback((query: string) => {
    setDisplayQuery(query);
  }, 400);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="flex flex-col gap-6">
      <SearchBar
        onChange={handleSearchChange}
        onSearch={handleSearchChange}
        className="bg-background-muted/40"
      />
      <AddFriendTab
        searchQuery={displayQuery}
        isPendingAction={isPendingGlobal}
        onAction={handleFriendAction}
      />
    </div>
  );
}
