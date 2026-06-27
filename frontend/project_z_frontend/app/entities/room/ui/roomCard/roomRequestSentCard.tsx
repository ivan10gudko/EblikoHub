import GroupIcon from "@mui/icons-material/Group";
import { Button } from "~/shared/ui/Button";
import type { RoomRequestShort } from "../../model/room.types";

interface RoomSentRequestCardProps {
    request: RoomRequestShort;
    isPendingAction: boolean;
    onCancel: () => void;
}

export const RoomRequestSentCard = ({ request, isPendingAction, onCancel }: RoomSentRequestCardProps) => {
    const { room } = request;

    return (
        <div className="flex flex-col w-full border border-border bg-card transition-all hover:border-primary">
            <div className="relative h-40 w-full overflow-hidden">
                <img src={room.imageUrl || "/defaultTitleRecordImage.jpg"} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex flex-col gap-2">
                <h3 className="text-lg font-bold text-foreground truncate">{room.roomName}</h3>
                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5 text-foreground-muted text-sm">
                        <GroupIcon className="text-sm" />
                        <span>{room.usersCount}</span>
                    </div>
                    <Button 
                        className="h-8 text-xs bg-transparent px-3 border border-danger text-danger hover:bg-danger hover:text-white" 
                        onClick={onCancel} 
                        disabled={isPendingAction}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};