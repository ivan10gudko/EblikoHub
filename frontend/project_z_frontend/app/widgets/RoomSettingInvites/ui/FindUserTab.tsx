import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

import { useRoomRequests } from "~/entities/room/hooks/useRoomRequests";
import type { UserShort, UserWithRelationsToRoomDto } from "~/entities/room/model/room.types";
import { useRoomUserSearch } from "~/entities/room";
import { UserSearchDropdown } from "~/entities/user";
import { UserAvatar } from "~/entities/user"; 

interface FindUserTabProps {
  roomId: number;
}

export const FindUserTab = ({ roomId }: FindUserTabProps) => {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState<UserShort[]>([]);

  const { data, isLoading: isSearchLoading, error: searchError } = useRoomUserSearch(roomId, query);
  const { sendInvite, isSendingInvite } = useRoomRequests(roomId);

  const searchResults = data?.pages.flatMap((page) => page.content || []) || [];

  const handleSelectUser = (item: UserWithRelationsToRoomDto) => {
    const user = item.user;

    sendInvite(
      { roomId, receiverId: user.userId },
      {
        onSuccess: () => {
          if (!invitedUsers.some((u) => u.userId === user.userId)) {
            setInvitedUsers((prev) => [...prev, user]);
          }
          setQuery("");
          setIsDropdownOpen(false);
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full text-foreground">
      <div className="flex flex-col gap-2 relative">
        <label className="text-sm font-semibold text-foreground/80">Search Users to Invite</label>
        <div className="relative w-full max-w-md">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/80" fontSize="small" />
          <input
            type="text"
            value={query}
            disabled={isSendingInvite}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder={isSendingInvite ? "Sending invite..." : "Type name or @nametag..."}
            className="w-full bg-card border-2 border-border/40 rounded-xl py-3 pl-11 pr-4 text-sm text-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
          />
        </div>

        {isDropdownOpen && query.trim().length > 0 && (
          <div className="w-full max-w-md absolute top-[76px] left-0 z-[110]">
            <UserSearchDropdown<UserWithRelationsToRoomDto>
              results={searchResults}
              mapToDisplayItem={(r) => ({
                userId: r.user.userId,
                name: r.user.name,
                nameTag: r.user.nameTag,
                img: r.user.img
              })}
              isLoading={isSearchLoading || isSendingInvite}
              onSelect={handleSelectUser}
              onClose={() => setIsDropdownOpen(false)}
            />
          </div>
        )}
      </div>

      {searchError && (
        <div className="text-sm text-danger bg-danger/10 border border-danger/20 px-4 py-2 rounded-xl max-w-md">
          Something went wrong during search...
        </div>
      )}

      
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold font-industrial text-foreground tracking-wide">
            Invited in this session
          </h3>
          <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
            {invitedUsers.length}
          </span>
        </div>

        {invitedUsers.length === 0 ? (
          <p className="text-sm text-neutral-600 italic py-2">No invites sent yet.</p>
        ) : (
         
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {invitedUsers.map((user) => (
              <div
                key={user.userId}
                className="relative flex items-center gap-4 p-4 bg-card/60 backdrop-blur-md border border-border rounded-xl min-h-[96px] w-full"
              >
                <div className="flex-shrink-0">
                  <UserAvatar name={user.name || "Unknown"} src={user.img} size="md" />
                </div>

                <div className="flex flex-col min-w-0 flex-1 pr-2">
                  <span className="text-sm font-bold text-foreground truncate tracking-wide">
                    {user.name || "Unknown User"}
                  </span>
                  {user.nameTag && (
                    <span className="text-xs text-muted-foreground/70 truncate mt-0.5 font-medium">
                      @{user.nameTag}
                    </span>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-[10px] font-semibold text-emerald-500 bg-success/20 border border-success/40 px-2 py-0.5 rounded-full">
                      Invited
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};