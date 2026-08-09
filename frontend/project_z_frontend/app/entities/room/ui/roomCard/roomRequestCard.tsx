import { Link } from "react-router";
import GroupIcon from "@mui/icons-material/Group";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "~/shared/ui/Button";
import type { RoomRequestShort } from "../../model/room.types";

interface RoomRequestCardProps {
    request: RoomRequestShort;
    isPendingAction: boolean;
    onAccept: () => void;
    onReject: () => void;
}

const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";

export const RoomRequestCard = ({
    request,
    isPendingAction,
    onAccept,
    onReject
}: RoomRequestCardProps) => {
    const { room, sender } = request;

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.preventDefault();
        e.stopPropagation();
        action();
    };

    return (
        <Link 
            to={`/rooms/${room.roomId}`}
            className="group flex flex-col w-full rounded-xl border border-border bg-card transition-all hover:border-primary cursor-pointer overflow-hidden"
        >
            <div className="relative h-54 md:h-44 w-full overflow-hidden">
                <img
                    src={room.imageUrl || DEFAULT_IMAGE_PATH}
                    alt={room.roomName}
                    className="w-full h-full object-cover transition-transform duration-300 "
                />
            </div>

            <div className="p-4 flex flex-col gap-2">
                <div>
                    <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {room.roomName}
                    </h3>
                    <p className="text-xs text-foreground-muted truncate">
                        From: <span className="font-medium text-foreground">{sender.name}</span>
                    </p>
                </div>

                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5 text-foreground-muted text-sm">
                        <GroupIcon className="text-sm" />
                        <span>{room.usersCount}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            variant="altCancel"
                            className="h-12 w-12 md:h-9 md:w-9 p-0 rounded-lg"
                            onClick={(e) => handleAction(e, onReject)}
                            disabled={isPendingAction}
                        >
                            <CloseIcon className="text-base" />
                        </Button>
                        <Button
                            variant="accept"
                            className="h-12 w-12 md:h-9 md:w-9 p-0 rounded-lg"
                            onClick={(e) => handleAction(e, onAccept)}
                            disabled={isPendingAction}
                        >
                            <CheckIcon className="text-base hover:text-emerald-500" />
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
};