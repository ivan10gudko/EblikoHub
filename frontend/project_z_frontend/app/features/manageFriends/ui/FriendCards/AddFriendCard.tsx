import { Link } from "react-router";
import { UserAvatar } from "~/entities/user";
import { Button } from "~/shared/ui/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonAddDisabledIcon from "@mui/icons-material/PersonAddDisabled";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import type { UserDtoWithFriendshipStatus } from "~/entities/friendship";
import { RequestStatus } from "~/shared/types";

interface FriendCardAddProps {
    user: UserDtoWithFriendshipStatus;
    onAction: (actionType: "send" | "delete", id: string) => void;
    isPendingAction?: boolean;
}

export const FriendCardAdd = ({ user, onAction, isPendingAction }: FriendCardAddProps) => {
    const { friendshipStatus: status, userId, friendshipId } = user;

    const renderActionButtons = () => {
        switch (status) {
            case RequestStatus.NONE:
            case RequestStatus.REJECTED:
                return (
                    <Button
                        disabled={isPendingAction}
                        className="h-10 px-4 bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:text-primary-hover font-bold text-sm gap-2 rounded-xl disabled:opacity-50 transition-colors whitespace-nowrap flex items-center justify-center cursor-pointer"
                        onClick={() => onAction("send", userId)}
                    >
                        <PersonAddIcon fontSize="small" />
                        <span>{status === RequestStatus.REJECTED ? "Rejected" : "Add"}</span>
                    </Button>
                );
                   
            case RequestStatus.PENDING:
                return (
                    <Button
                        variant="outline"
                        disabled={isPendingAction}
                        className="w-full border-danger/30 text-white/70 hover:bg-danger/20 hover:text-danger gap-2 px-4 py-2 rounded-xl bg-danger/40"
                        onClick={() => onAction("delete", friendshipId ?? userId)}
                    >
                        <PersonAddIcon fontSize="small" />
                        <span>Cancel</span>
                    </Button>
                );

            case RequestStatus.ACCEPTED:
                return (
                    <div className="text-success flex items-center gap-2 px-4 py-2 font-bold">
                        <HowToRegIcon fontSize="small" />
                        <span>Friends</span>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col md:flex-row  items-stretch md:items-center gap-4 p-4 rounded-xl bg-background-muted/20 border border-border/50 hover:border-primary/50 hover:bg-background-muted/40 transition-all duration-300 group">
            <Link to={`/profile/${userId}`} className="flex items-center gap-4 grow min-w-0 focus:outline-none">
                <div className="relative p-[2px] rounded-full border-1 border-primary shrink-0">
                    <UserAvatar src={user.img ?? undefined} name={user.name} size="md" />
                </div>
                <div className="flex flex-col min-w-0 truncate">
                    <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {user.name}
                    </span>
                    <span className="text-sm font-mono  text-foreground/50 truncate">@{user.nameTag}</span>
                </div>
            </Link>

            <div className="flex items-center gap-2 shrink-0 pt-4 md:pt-0">
                {renderActionButtons()}
            </div>
        </div>
    );
};