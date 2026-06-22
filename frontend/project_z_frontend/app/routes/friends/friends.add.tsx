import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { AddFriendTab } from "~/features/manageFriends/ui/FriendsTabs/AddFriendTab";
import SearchBar from "~/shared/ui/SearchBar";
import { useFriends } from "~/features/manageFriends/hooks/useFriends";

export default function AddFriendPage() {
  const { userId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { isPendingGlobal, handleFriendAction } = useFriends(userId!, "add");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);
  return (
    <div className="flex flex-col gap-6">
      <SearchBar
        onChange={setSearchQuery}
        onSearch={setSearchQuery}
        className="bg-background-muted/40"
      />
      <AddFriendTab
        searchQuery={debouncedQuery} 
        isPendingAction={isPendingGlobal}
        onAction={handleFriendAction}
      />
    </div>
  );
}
