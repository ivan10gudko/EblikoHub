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
      
      <div className="flex flex-nowrap gap-1.5 pb-1 w-full custom-scrollbar overflow-x-auto overflow-y-hidden items-center">
        {selectedUsers.map(userMember => (
          <div 
            key={userMember.user.userId} 
            className="user-card-item flex items-center gap-1 px-2.5 hover:text-primary border border-border bg-card hover:bg-primary/10 rounded-lg py-1 hover:border-primary/30 text-xs whitespace-nowrap text-foreground"
          >
            <UserAvatar size='min' name={userMember.user.name} src={userMember.user.img} />
            <span>{userMember.user.name}</span>
          </div>
        ))}
      </div>

      <Popover.Root>
        <Popover.Trigger asChild>
         
          <div className="user-card-item w-69 p-2.5 border border-border rounded-lg text-xs text-foreground cursor-pointer">
            {selectedIds.length > 0 ? `${selectedIds.length} users selected` : "Select users..."}
          </div>
        </Popover.Trigger>

        <Popover.Content
          className="w-72 bg-background border border-border p-1.5 rounded-xl shadow-2xl z-50 animate-enter"
          sideOffset={8}
          align="start"
        >
          <div className="flex flex-col gap-1 max-h-[250px] overflow-y-auto pr-1 hide-scrollbar">
            {members.map(member => {
              const isSelected = selectedIds.includes(member.user.userId);
              return (
                <div
                  key={member.user.userId}
                  onClick={() => handleToggle(member.user.userId)}
                
                  className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-primary/10 text-primary font-bold' 
                      : 'bg-card hover:bg-primary/10 border border-border hover:border-primary/30  text-foreground hover:text-primary'
                  }`}
                >
                  <UserAvatar size='min' name={member.user.name} src={member.user.img} />
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