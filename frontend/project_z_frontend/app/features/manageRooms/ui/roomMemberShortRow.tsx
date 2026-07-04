import { Link } from "react-router";
import { UserAvatar } from "~/entities/user";
import type { RoomMemberShort } from "../../../entities/room/model/room.types";
import { RoomMemberRoleBadge } from "~/features/manageRooms/ui/RoomMemberRoleBadge";

export const RoomMemberRow = ({
    member,
    action
}: {
    member: RoomMemberShort,
    action?: React.ReactNode
}) => {
    return (
        <div className="flex items-center justify-between gap-3 p-2 bg-card border border-border hover:bg-primary/10 hover:border-primary/30 rounded-xl transition-all group cursor-pointer">
            <Link
                to={`/profile/${member.user.userId}`}
                className="flex items-center gap-3 flex-1 min-w-0" 
            >
                <UserAvatar
                    name={member.user.name}
                    src={member.user.img}
                    size="sm"
                />
                
                <div className="flex flex-col min-w-0 truncate">
                    <p className="font-bold text-sm truncate text-foreground group-hover:text-primary transition-colors">
                        {member.user.name}
                    </p>
                    
                    
                    <div className="flex flex-row-reverse items-center  gap-1 mt-0.5">
                        
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">
                                @{member.user.nameTag}
                            </span>
                        
                        <RoomMemberRoleBadge role={member.role} />
                    </div>
                </div>
            </Link>

            {action && (
                <div className="flex-shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
};