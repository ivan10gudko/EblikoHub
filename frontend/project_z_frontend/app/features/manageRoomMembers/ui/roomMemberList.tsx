import type { RoomMemberShort } from "~/entities/room";
import { RoomMemberRow } from "./roomMemberShortRow";

export const RoomMembersList = ({ members }: { members: RoomMemberShort[] }) => {
  return (
    <div className="flex flex-col gap-1 w-full box-border">
      <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-2 mb-2">
        Room Members
      </h3>
      
      <div className="flex flex-col gap-2 h-fit max-h-[190px] overflow-y-auto hide-scrollbar w-full box-border">
        {members.map((member) => (
          <div key={member.id} className="w-full">
            <RoomMemberRow member={member} />
          </div>
        ))}
      </div>
    </div>
  );
};