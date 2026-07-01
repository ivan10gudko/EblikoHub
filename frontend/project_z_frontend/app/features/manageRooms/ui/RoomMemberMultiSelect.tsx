import * as Popover from '@radix-ui/react-popover';
import { type RoomMemberShort } from "~/entities/room/model/room.types";
import { UserAvatar } from '~/entities/user';
interface UserMultiSelectProps {
  members: RoomMemberShort[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export const RoomMemberMultiSelect = ({ members, selectedIds, onChange }: UserMultiSelectProps) => {
  const safeSelectedIds = selectedIds.filter(id => id != null);

  const selectedUsers = members.filter(m => safeSelectedIds.includes(m.user.userId));
  const handleToggle = (id: string) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter(uid => uid !== id)
      : [...selectedIds, id];
    onChange(newIds);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5 pb-1 min-h-[32px] custom-scrollbar overflow-x-auto">
        {selectedUsers.map(userMember => (
          <div key={userMember.user.userId} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full text-xs whitespace-nowrap">
            <UserAvatar size='min' name={userMember.user.name} src={userMember.user.imageUrl} />
            <span>{userMember.user.name}</span>
          </div>
        ))}
      </div>

      <Popover.Root>
        <Popover.Trigger asChild>
          <div className="w-full bg-background border border-border p-2.5 rounded-lg text-xs text-muted-foreground cursor-pointer hover:border-primary transition-colors">
            {selectedIds.length > 0 ? `${selectedIds.length} users selected` : "Select users..."}
          </div>
        </Popover.Trigger>

        <Popover.Content
          className="w-72 bg-background border border-border p-2 rounded-xl shadow-xl z-50"
          sideOffset={8}
          align="start"
        >
          <div className="flex flex-col gap-1 max-h-[250px] overflow-y-auto">
            {members.map(member => {
              const isSelected = selectedIds.includes(member.user.userId);
              return (
                <div
                  key={member.user.userId}
                  onClick={() => handleToggle(member.user.userId)}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'
                    }`}
                >
                  <UserAvatar size='min' name={member.user.name} src={member.user.imageUrl} />
                  <span className="text-sm font-medium">{member.user.name}</span>
                </div>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};