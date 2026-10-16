import { useState } from "react";
import { roomTitleService } from "~/features/manageRoomTitles/api/roomTitleService";
import { RoomTitleItem } from "./RoomTitleItem";
import { useAuthStore } from "~/features/auth";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useRoomMemberByRoomIdAndUserId } from "~/features/manageRoomMembers";
import { useRoomTitleActions, roomTitleKeys } from "~/features/manageRoomTitles";
import { RoomRole } from "~/entities/room";
import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
import SearchBar from "~/shared/ui/SearchBar";

export const RoomTitlesManager = ({ roomId }: { roomId: number }) => {
  const [search, setSearch] = useState("");
  const { userId } = useAuthStore();
  const navigate = useNavigate();
  const { data: currentUser } = useRoomMemberByRoomIdAndUserId(userId!, roomId);

  const currentUserRole = currentUser ? currentUser.role : null;
  const isCurrentUserAdmin = currentUserRole === RoomRole.ADMIN || currentUserRole === RoomRole.OWNER;
  const isReadOnly = !currentUserRole;

  const { data: titles = [], isLoading } = useQuery({
    queryKey: [...roomTitleKeys.all, roomId],
    queryFn: () => roomTitleService.findAll(roomId),
  });

  const { deleteTitle, isPending } = useRoomTitleActions(roomId);

  const filteredTitles = titles.filter((item) =>
    item.titleName.toLowerCase().includes(search.toLowerCase().trim())
  );

  if (isLoading) {
    return <div className="p-4 text-muted-foreground font-semibold">Loading titles...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-1 w-full">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Room Titles</h2>
          <p className="text-sm text-muted-foreground">
            {isReadOnly ? "View the list of titles in this room" : "Manage the list of titles for this room"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isReadOnly ? (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              Read-Only Mode
            </span>
          ) : (
            <button
              onClick={() => navigate("add")}
              disabled={isPending}
              className="h-10 px-4 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold border border-primary/30 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              + Add Title
            </button>
          )}
        </div>
      </div>

      <div className="w-full">
        <SearchBar
          placeholder="Search titles..."
          onSearch={(query) => setSearch(query)}
          debounceMs={100}
          className="w-full"
          initialValue={search}
        />
      </div>

      {titles.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-border rounded-lg text-muted-foreground italic w-full">
          There are no titles added to this room yet.
        </div>
      ) : (
        <div className="grid gap-3 w-full">
          {filteredTitles.map((item) => (
            <RoomTitleItem
              key={item.id}
              item={item}
              onDelete={deleteTitle}
              defaultImagePath={DEFAULT_IMAGE_PATH}
              isOwn={!isReadOnly && item.addedByUser.userId === userId}
              isCurrentUserAdmin={!isReadOnly && isCurrentUserAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
};