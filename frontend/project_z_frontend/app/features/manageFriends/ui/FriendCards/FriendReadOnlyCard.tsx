import { Link } from "react-router";
import { UserAvatar, type UserProfile } from "~/entities/user";

export const ReadOnlyFriendCard = ({ user }: { user: UserProfile }) => {
    return (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-background-muted/20 border border-border/40 hover:bg-background-muted/30 transition-all">
            <Link to={`/profile/${user.userId}`} className="flex items-center gap-4 grow">
                <UserAvatar src={user.img ?? undefined} name={user.name} size="md" />
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-foreground">{user.name}</span>
                    <span className="text-sm font-mono text-foreground/50">@{user.nameTag}</span>
                </div>
            </Link>
        </div>
    );
};