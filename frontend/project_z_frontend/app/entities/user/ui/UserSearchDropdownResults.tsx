import { Button } from "~/shared/ui/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import type { UserProfile } from "../model/user.types";
import { UserAvatar } from "./UserAvatar";

interface UserSearchDropdownProps {
  results: UserProfile[];
  onSelect: (user: UserProfile) => void;
  onClose: () => void;
  isLoading?: boolean; 
}

export const UserSearchDropdown = ({
  results,
  onSelect,
  onClose,
  isLoading
}: UserSearchDropdownProps) => {
  
  return (
    <div className="absolute left-0 right-0 z-[100] mt-1 bg-background border-2 border-border rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      
      <div className="px-4 py-2 bg-background-muted/50 border-b border-border flex justify-between items-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {isLoading ? "Searching..." : results.length > 0 ? "Results" : "No users found"}
        </span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xs">Close</button>
      </div>

      <div className="max-h-[280px] overflow-y-auto custom-scrollbar relative">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
        ) : results.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <SearchOffIcon className="opacity-50" />
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          results.map((user) => (
            <div
              key={user.userId}
              className="flex items-center gap-3 p-4 hover:bg-background-muted cursor-pointer transition-colors border-b border-border last:border-0"
            >
              <UserAvatar name={user.name} src={user.img} size="sm" />
              <div className="flex-grow min-w-0">
                <p className="font-bold text-foreground text-sm truncate">{user.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">@{user.nameTag}</p>
              </div>
              <Button
                onClick={() => onSelect(user)}
                className="p-1 hover:bg-primary/20 rounded-full transition-colors"
              >
                <AddCircleOutlineIcon className="text-primary" fontSize="small" />
              </Button>
            </div>
          ))
        )}
      </div>
      
      {results.length > 3 && (
        <div className="h-4 bg-gradient-to-t from-background to-transparent pointer-events-none -mt-4 relative" />
      )}
    </div>
  );
};