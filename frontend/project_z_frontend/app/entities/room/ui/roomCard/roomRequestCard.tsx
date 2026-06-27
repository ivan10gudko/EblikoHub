
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

    return (
        <div className="flex flex-col w-full border border-border bg-card transition-all hover:border-primary">
            <div className="relative h-40 w-full overflow-hidden">
                <img
                    src={room.imageUrl || DEFAULT_IMAGE_PATH}
                    alt={room.roomName}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-4 flex flex-col gap-2">
                <div>
                    <h3 className="text-lg font-bold text-foreground truncate">{room.roomName}</h3>
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
                            className="h-8 w-8 p-0"
                            onClick={onReject}
                            disabled={isPendingAction}
                        >
                            <CloseIcon className="text-base" />
                        </Button>
                        <Button
                            className="h-8 w-8 p-0 "
                            onClick={onAccept}
                            disabled={isPendingAction}
                        >
                            <CheckIcon className="text-base" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};