import { Link } from "react-router";
import { UserAvatar } from "~/entities/user";
import type { RoomMemberShort } from "../../../entities/room/model/room.types";
export const RoomMemberRow = ({
    member,
    action
}: {
    member: RoomMemberShort,
    action?: React.ReactNode
}) => {
    return (
        <div className="flex items-center justify-between gap-3 p-2 hover:bg-primary/10 rounded-lg transition-colors group">
            <Link
                to={`/profile/${member.user.userId}`}
                className="flex items-center gap-3 flex-1 min-w-0" 
            >
                <UserAvatar
                    name={member.user.name}
                    src={member.user.imageUrl}
                    size="sm"
                />
                <div className="flex flex-col truncate">
                    <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                        {member.user.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {member.role} • @{member.user.nameTag}
                    </p>
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