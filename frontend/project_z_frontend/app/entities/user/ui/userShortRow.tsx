import type { UserProfile } from "../model/user.types";
import { UserAvatar } from "./UserAvatar";

export const UserShortRow = ({ user, action, children }: {
    user: UserProfile,
    action?: React.ReactNode,
    children?: React.ReactNode
}) => (
    <div className="flex items-center gap-3 p-2 hover:bg-background-muted rounded-lg transition-colors">
        <UserAvatar name={user.name} src={user.img} size="sm" />
        <div className="flex-grow min-w-0">
            <p className="font-bold text-sm truncate">{user.name}</p>
            <p className="text-[10px] text-muted-foreground uppercase">@{user.nameTag}</p>
        </div>
        {action}
        {children}
    </div>
);