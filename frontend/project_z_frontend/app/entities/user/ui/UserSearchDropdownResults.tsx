import { Button } from "~/shared/ui/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { UserAvatar } from "./UserAvatar";

export interface SearchDisplayItem {
  userId: string;     
  name: string;
  nameTag: string;
  img?: string;
  isInvited?: boolean;
  isMember?: boolean;
}

interface UserSearchDropdownProps<T> {
  results: T[];
  mapToDisplayItem: (item: T) => SearchDisplayItem;
  onSelect: (item: T) => void;
  onClose?: () => void;
  isLoading?: boolean;
}

export const UserSearchDropdown = <T,>({
  results,
  onSelect,
  onClose,
  mapToDisplayItem, 
  isLoading,
}: UserSearchDropdownProps<T>) => {
  return (
    <div className="absolute left-0 right-0 z-[100] mt-1 bg-background border-2 border-border rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 shadow-xl">
      <div className="px-4 py-2 bg-background-muted/50 border-b border-border flex justify-between items-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted">
          {isLoading
            ? "Searching..."
            : results.length > 0
              ? "Results"
              : "No users found"}
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-foreground-muted hover:text-foreground text-xs font-semibold transition-colors"
          >
            Close
          </button>
        )}
      </div>

      <div className="max-h-[280px] overflow-y-auto custom-scrollbar relative">
        {isLoading ? (
          <div className="p-8 text-center text-foreground-muted text-sm">
            Loading...
          </div>
        ) : results.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center text-foreground-muted gap-2">
            <SearchOffIcon className="opacity-50" />
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          results.map((user) => {
            const display = mapToDisplayItem(user);
            const isInteractionDisabled = display.isInvited || display.isMember;

            return (
              <div
                onClick={() => {
                  if (!isInteractionDisabled) {
                    onSelect(user);
                  }
                }}
                key={display.userId}
                className={`flex items-center justify-between gap-3 p-4 transition-colors border-b border-border last:border-0 ${
                  isInteractionDisabled 
                    ? "bg-background/40 cursor-default" 
                    : "hover:bg-background-muted cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <UserAvatar name={display.name} src={display.img} size="sm" />
                  <div className="min-w-0">
                    <p className="font-bold text-foreground text-sm truncate">
                      {display.name}
                    </p>
                    <p className="text-[10px] text-foreground-muted uppercase tracking-wider font-medium mt-0.5">
                      @{display.nameTag}
                    </p>
                  </div>
                </div>

               
                {display.isMember ? (
                  <span className="text-[11px] font-medium text-foreground-muted bg-background-muted px-2.5 py-1 rounded-lg border border-border flex-shrink-0">
                    Member
                  </span>
                ) : display.isInvited ? (
                  <span className="text-[11px] font-semibold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 flex-shrink-0">
                    Pending
                  </span>
                ) : (
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(user);
                    }}
                    className="p-2 bg-transparent hover:bg-primary/20 border border-border hover:border-primary/40 rounded-full transition-all group flex items-center justify-center flex-shrink-0"
                  >
                    <AddCircleOutlineIcon
                      className="text-primary group-hover:scale-110 transition-transform"
                      fontSize="small"
                    />
                  </Button>
                )}
              </div>
            );
          })
        )}
      </div>

      {results.length > 3 && (
        <div className="h-4 bg-gradient-to-t from-background to-transparent pointer-events-none -mt-4 relative" />
      )}
    </div>
  );
};