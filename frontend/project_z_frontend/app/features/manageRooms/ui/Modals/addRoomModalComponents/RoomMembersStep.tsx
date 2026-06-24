import {
  UserSearchDropdown,
  UserShortRow,
  type UserProfile,
} from "~/entities/user";
import { Button } from "~/shared/ui/Button";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchBar from "~/shared/ui/SearchBar";
interface MembersStepProps {
  addedUsers: UserProfile[];
  onSearch: (query: string) => void;
  searchResults: UserProfile[];
  onSelect: (user: UserProfile) => void;
  onRemove: (userId: string) => void;
  isLoading: boolean;
}

export const MembersStep = ({
  addedUsers,
  onSearch,
  searchResults,
  onSelect,
  onRemove,
  isLoading,
}: MembersStepProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="relative space-y-4">
      <SearchBar
        onSearch={onSearch}
        onChange={onSearch}
        placeholder="Search users..."
      />
      {searchResults.length > 0 && (
        <UserSearchDropdown
          results={searchResults}
          onSelect={onSelect}
          isLoading={isLoading}
        />
      )}
    </div>

    <div className="bg-background-muted/30 rounded-xl p-4 border border-border min-h-[300px] flex flex-col">
      <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3">
        Added Members ({addedUsers.length})
      </h4>
      <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
        {addedUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground italic text-center mt-10">
            No users added yet
          </p>
        ) : (
          addedUsers.map((user: any) => (
            <UserShortRow
              key={user.userId}
              user={user}
              action={
                <Button
                  onClick={() => onRemove(user.userId)}
                  className="text-background bg-danger p-1"
                >
                  <DeleteOutlineIcon fontSize="small" />
                </Button>
              }
            />
          ))
        )}
      </div>
    </div>
  </div>
);
