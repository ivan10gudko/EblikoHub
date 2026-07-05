import { Link } from "react-router";
import { UserAvatar, type UserProfile } from "~/entities/user";
import { Button } from "~/shared/ui/Button";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonAddDisabledIcon from "@mui/icons-material/PersonAddDisabled";
import type { FriendActionType, FriendCardVariant } from "../../types/friends.types";

interface FriendCardProps {
    user: UserProfile & { friendshipId?: string };
    variant: FriendCardVariant;
    onAction?: (actionType: FriendActionType, id: string) => void;
    isPendingAction?: boolean;
}
export const FriendCard = ({ user, variant, onAction, isPendingAction }: FriendCardProps) => {
    return (
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 p-4 rounded-xl bg-background-muted/20 border border-border/40 hover:border-primary/50 hover:bg-background-muted/40 transition-all duration-300 group">

            <Link
                to={`/profile/${user.userId}`}
                className="flex items-center gap-4 grow min-w-0 focus:outline-none"
            >
                <div className="relative p-[2px] rounded-full border-1 border-primary shadow-[0_0_10px_rgba(251,146,6,0.1)] group-hover:shadow-[0_0_14px_rgba(251,146,6,0.2)] transition-all duration-300 shrink-0">
                    <UserAvatar src={user.img ?? undefined} name={user.name} size="md" />
                </div>

                <div className="flex flex-col min-w-0 truncate">
                    <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {user.name}
                    </span>
                    <span className="text-sm font-mono text-foreground/50 truncate">
                        @{user.nameTag}
                    </span>
                </div>
            </Link>

            <div className="flex items-center gap-2  shrink-0 md:border-0 border-t border-border/20 pt-4 md:pt-0">
                {variant === "friends" && (
                    <Button
                        variant="outline"
                        disabled={isPendingAction}
                        className="w-full border-danger/30 text-foreground/70 hover:bg-danger/20 hover:text-danger gap-2 px-4 py-2 rounded-xl bg-danger/40"
                        onClick={() => onAction?.("delete", user.friendshipId || user.userId)}
                    >
                        <PersonRemoveIcon fontSize="small" />
                    </Button>
                )}

                {variant === "pending" && (
                    <div className="flex w-full gap-2">
                        <Button
                            disabled={isPendingAction}
                            className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold border border-primary/30 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
                            onClick={() => onAction?.("accept", user.userId)}
                        >
                            <CheckIcon fontSize="small" />
                        </Button>
                        <Button
                            variant="outline"
                            disabled={isPendingAction}
                            className="w-full border-danger/30 text-white/70 hover:bg-danger/20 hover:text-danger gap-2 px-4 py-2 rounded-xl bg-danger/40"
                            onClick={() => onAction?.("reject", user.userId)}
                        >
                            <ClearIcon fontSize="small" />
                        </Button>
                    </div>
                )}

                {variant === "add" && (
                    <Button
                        disabled={isPendingAction}
                        className="w-full bg-primary/40 text-becgraund hover:text-primary/70 border border-primary hover:bg-primary-hover/20 font-bold gap-2 px-4 py-2 rounded-xl"
                        onClick={() => onAction?.("send", user.userId)}
                    >
                        <PersonAddIcon fontSize="small" />
                        <span>Add</span>
                    </Button>
                )}

                {variant === "sent" && (
                    <Button
                        variant="outline"
                        disabled={isPendingAction}
                        className="w-full border-danger/30 text-foreground/70 hover:bg-danger/20 hover:text-danger gap-2 px-4 py-2 rounded-xl bg-danger/40"
                        onClick={() => onAction?.("delete", user.friendshipId || user.userId)}
                    >
                        <PersonAddDisabledIcon fontSize="small" />
                        <span>Cancel</span>
                    </Button>
                )}
            </div>
        </div>
    );
};