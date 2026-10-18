import { useState } from "react";
import { roomTitleService } from "~/features/manageRoomTitles/api/roomTitleService";
import { RoomTitleItem } from "./RoomTitleItem";
import { useAuthStore } from "~/features/auth";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useRoomMemberByRoomIdAndUserId } from "~/features/manageRoomMembers";
import { useRoomTitleActions, roomTitleKeys } from "~/features/manageRoomTitles";
import { useBatchCreateRoomTitles } from "~/features/manageRoomTitles/hooks/useBatchCreateRoomTitles";
import { RoomRole } from "~/entities/room";
import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
import SearchBar from "~/shared/ui/SearchBar";
import { AiSuggestionsDropdown } from "./AiSuggestionsDropdown";
import { TitleType } from "~/entities/titleRecord";

export const RoomTitlesManager = ({ roomId }: { roomId: number }) => {
  const [search, setSearch] = useState("");
  const [isAiDropdownOpen, setIsAiDropdownOpen] = useState(false);

  const { userId } = useAuthStore();
  const navigate = useNavigate();
  const { data: currentUser } = useRoomMemberByRoomIdAndUserId(userId!, roomId);

  const currentUserRole = currentUser ? currentUser.role : null;
  const isReadOnly = !currentUserRole;
  const isCurrentUserAdmin = currentUserRole === RoomRole.ADMIN || currentUserRole === RoomRole.OWNER;

  const { data: titles = [], isLoading } = useQuery({
    queryKey: roomTitleKeys.listNoPaged(roomId),
    queryFn: () => roomTitleService.findAll(roomId),
  });

  const { data: suggestedTitles = [], isLoading: isSuggestionsLoading } = useQuery({
    queryKey: roomTitleKeys.suggestions(roomId),
    queryFn: () => roomTitleService.suggestTitlesToAdd(roomId),
    enabled: isAiDropdownOpen,
  });

  const { deleteTitle, isPending } = useRoomTitleActions(roomId);

  const { batchCreateTitles, isPending: isBatchPending } = useBatchCreateRoomTitles({
    roomId,
    onSuccess: () => setIsAiDropdownOpen(false),
  });

  const filteredTitles = titles.filter((item) =>
    item.titleName.toLowerCase().includes(search.toLowerCase().trim())
  );

  const handleConfirmSelection = (selectedIds: number[]) => {
    const dtos = selectedIds.map((titleId) => {
      const suggestion = suggestedTitles.find((s) => s.titleId === titleId);
      return {
        titleId: suggestion?.titleId ?? titleId,
        apiTitleId: suggestion?.apiTitleId ?? null,
        titleName: suggestion?.titleName ?? "title",
        imageUrl: suggestion?.imageUrl ?? null,
        titleType: suggestion?.titleType ?? TitleType.ANIME,
      };
    });

    batchCreateTitles(dtos);
  };

  if (isLoading) {
    return <div className="p-4 text-muted-foreground font-semibold">Loading titles...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-1 w-full">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Room Titles</h2>
          <p className="text-sm text-muted-foreground">
            {isReadOnly ? "View the list of titles in this room" : "Manage the list of titles for this room"}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!isReadOnly && (
            <AiSuggestionsDropdown
              isOpen={isAiDropdownOpen}
              onOpenChange={setIsAiDropdownOpen}
              suggestedTitles={suggestedTitles}
              isLoading={isSuggestionsLoading || isBatchPending}
              onConfirmSelection={handleConfirmSelection}
            />
          )}

          {isReadOnly ? (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 whitespace-nowrap">
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