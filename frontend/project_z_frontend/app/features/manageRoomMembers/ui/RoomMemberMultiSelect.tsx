import * as Popover from '@radix-ui/react-popover';
import { type RoomMemberShort } from "~/entities/room/model/room.types";
import { UserAvatar } from '~/entities/user';
import CheckIcon from "@mui/icons-material/Check";
interface UserMultiSelectProps {
  members: RoomMemberShort[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

const truncateName = (name: string, maxLength = 15) => {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength) + '...';
};

export const RoomMemberMultiSelect = ({ members, selectedIds, onChange }: UserMultiSelectProps) => {
  const safeSelectedIds = selectedIds.filter(id => id != null);
  const selectedUsers = members.filter(m => safeSelectedIds.includes(m.user.userId));

  const handleToggle = (id: string) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter(uid => uid !== id)
      : [...selectedIds, id];
    onChange(newIds);
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onChange(selectedIds.filter(uid => uid !== id));
  };

  const MAX_VISIBLE = 2;
  const visibleUsers = selectedUsers.slice(0, MAX_VISIBLE);
  const hiddenCount = selectedUsers.length - MAX_VISIBLE;

  return (
    <div className="flex flex-col gap-2 w-full">
      {selectedUsers.length > 0 && (
        <div className="flex items-center gap-1.5 w-full overflow-hidden flex-nowrap py-0.5">
          {visibleUsers.map(userMember => (
            <div
              onClick={(e) => handleRemove(e, userMember.user.userId)}
              key={userMember.user.userId}
              className="inline-flex items-center gap-1.5 px-2 py-2 border border-border bg-card hover:bg-danger/10 rounded-lg text-xs text-foreground group transition-colors shrink-0"
            >
              <UserAvatar size="min" name={userMember.user.name} src={userMember.user.img} />
              <span>{truncateName(userMember.user.name, 10)}</span>

            </div>
          ))}

          {hiddenCount > 0 && (
            <div className="inline-flex items-center px-2 py-1 border border-border bg-card rounded-lg text-xs text-muted-foreground shrink-0 font-medium">
              +{hiddenCount}
            </div>
          )}
        </div>
      )}

      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="w-full flex items-center justify-between p-2.5 border border-border bg-card hover:border-primary/50 rounded-xl text-xs text-foreground cursor-pointer transition-colors outline-none"
          >
            <span className="truncate">
              {selectedIds.length > 0
                ? `${selectedIds.length} user${selectedIds.length > 1 ? 's' : ''} selected`
                : "Select users..."}
            </span>
            <span className="text-muted-foreground text-[10px]">▼</span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="w-[var(--radix-popover-trigger-width)] bg-background border border-border p-1.5 rounded-xl shadow-2xl z-50 animate-in fade-in-0 zoom-in-95"
            sideOffset={6}
            align="start"
            collisionPadding={12}
          >
            <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto overscroll-contain pr-1 custom-scrollbar">
              {members.map(member => {
                const isSelected = selectedIds.includes(member.user.userId);
                return (
                  <div
                    key={member.user.userId}
                    onClick={() => handleToggle(member.user.userId)}
                    className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${isSelected
                      ? 'bg-primary/15 text-primary font-semibold'
                      : 'bg-card hover:bg-accent border border-transparent text-foreground'
                      }`}
                  >
                    <UserAvatar size="min" name={member.user.name} src={member.user.img} />
                    <span className="text-xs font-medium truncate flex-1">{member.user.name}</span>
                    {isSelected && <CheckIcon style={{ width: '16px', height: '16px' }} className="text-primary shrink-0" />}
                  </div>
                );
              })}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};