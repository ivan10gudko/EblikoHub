import type { RoomMemberShort } from "~/entities/room";
import { RoomMemberRow } from "./roomMemberShortRow";

export const RoomMembersList = ({ members }: { members: RoomMemberShort[] }) => {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-2 mb-2">
        Room Members
      </h3>
      
      <div className="flex flex-col gap-2 h-fit max-h-[190px] overflow-y-auto pr-1 hide-scrollbar">
        {members.map((member) => (
         
          <RoomMemberRow key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};