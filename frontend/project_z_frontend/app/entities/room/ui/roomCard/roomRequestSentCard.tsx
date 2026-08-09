import { Link } from "react-router";
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

    const handleCancel = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onCancel();
    };

    return (
        <Link
            to={`/rooms/${room.roomId}`}
            className="group flex flex-col w-full rounded-xl border border-border bg-card transition-all hover:border-primary cursor-pointer overflow-hidden"
        >
            <div className="relative h-54 md:h-44 w-full overflow-hidden">
                <img 
                    src={room.imageUrl || "/defaultTitleRecordImage.jpg"} 
                    alt={room.roomName}
                    className="w-full h-full object-cover transition-transform duration-300 " 
                />
            </div>
            <div className="p-4 flex flex-col gap-2">
                <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                    {room.roomName}
                </h3>
                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5 text-foreground-muted text-sm">
                        <GroupIcon className="text-sm" />
                        <span>{room.usersCount}</span>
                    </div>
                    <Button
                        variant="altCancel" 
                        className="h-12 w-40 md:h-8 md:w-20  p-0  rounded-lg cursor-pointer" 
                        onClick={handleCancel} 
                        disabled={isPendingAction}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Link>
    );
};