import { useState } from "react";
import { useParams } from "react-router";
import { AddFriendTab, useFriends } from "~/features/manageFriends";
import SearchBar from "~/shared/ui/SearchBar";
import { useDebounce } from "~/shared/hooks";

export default function AddFriendPage() {
  const { userId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const displayQuery = useDebounce(searchQuery, 400);

  const { isPendingGlobal, handleFriendAction } = useFriends(userId!, "add");

  return (
    <div className="flex flex-col gap-6">
      <SearchBar
        onChange={setSearchQuery}
        onSearch={setSearchQuery}
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
