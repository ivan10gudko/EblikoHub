import { useState } from "react";
import { useParams } from "react-router";
import { AddFriendTab } from "~/features/manageFriends/ui/FriendsTabs/AddFriendTab";
import SearchBar from "~/shared/ui/SearchBar";
import { useFriends } from "~/features/manageFriends/hooks/useFriends";

export default function AddFriendPage() {
  const { userId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const { isPendingGlobal, handleFriendAction } = useFriends(userId!, "add");

  return (
    <div className="flex flex-col gap-6">
      <SearchBar
        onChange={setSearchQuery}
        onSearch={setSearchQuery}
        className="bg-background-muted/40"
      />
      <AddFriendTab
        searchQuery={searchQuery}
        isPendingAction={isPendingGlobal}
        onAction={handleFriendAction}
      />
    </div>
  );
}
