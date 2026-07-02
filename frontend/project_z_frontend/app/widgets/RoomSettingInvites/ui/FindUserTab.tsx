import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

import { useRoomRequests } from "~/entities/room/hooks/useRoomRequests";
import type { UserShort } from "~/entities/room/model/room.types"; // Використовуємо UserShort з нових типів
import { useRoomUserSearch } from "~/entities/room";
import { UserSearchDropdown, UserShortRow } from "~/entities/user";

interface FindUserTabProps {
  roomId: number;
}

export const FindUserTab = ({ roomId }: FindUserTabProps) => {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Зберігаємо список успішно запрошених юзерів у цій сесії
  const [invitedUsers, setInvitedUsers] = useState<UserShort[]>([]);

  // Хук нескінченного пошуку від Головастого
  const { data, isLoading: isSearchLoading, error: searchError } = useRoomUserSearch(roomId, query);
  
  // Дістаємо правильні методи та лоадери з нашого хука
  const { sendInvite, isSendingInvite } = useRoomRequests(roomId);

  // Перетворюємо сторінки пагінації у плоский масив
  const searchResults = data?.pages.flatMap((page) => page.content || []) || [];

  const handleSelectUser = (user: UserShort) => {
    // Викликаємо правильну мутацію, прокидуючи roomId з пропсів та receiverId з об'єкта юзера
    sendInvite(
      { roomId, receiverId: user.userId },
      {
        onSuccess: () => {
          // Якщо такого юзера ще немає в списку запрошених сесії, додаємо його
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
    <div className="flex flex-col gap-6 w-full text-white">
      <div className="flex flex-col gap-2 relative">
        <label className="text-sm font-semibold text-neutral-400">Search Users to Invite</label>
        <div className="relative w-full max-w-md">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" fontSize="small" />
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
            className="w-full bg-[#141414] border-2 border-border/40 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
          />
        </div>

        {/* Дропдаун тепер отримує правильні результати з PageResponse структурою */}
        {isDropdownOpen && query.trim().length > 0 && (
          <div className="w-full max-w-md absolute top-[76px] left-0">
            <UserSearchDropdown
              results={searchResults}
              isLoading={isSearchLoading || isSendingInvite}
              onSelect={handleSelectUser}
              onClose={() => setIsDropdownOpen(false)}
            />
          </div>
        )}
      </div>

      {searchError && (
        <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl max-w-md">
          Something went wrong during search...
        </div>
      )}

      <div className="flex flex-col gap-3 w-full max-w-md mt-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-800 pb-2">
          Invited in this session ({invitedUsers.length})
        </h3>
        {invitedUsers.length === 0 ? (
          <p className="text-sm text-neutral-600 italic py-2">No invites sent yet.</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            {invitedUsers.map((user) => (
              <UserShortRow
                key={user.userId}
                user={user}
                action={
                  <div className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                    Invited
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};