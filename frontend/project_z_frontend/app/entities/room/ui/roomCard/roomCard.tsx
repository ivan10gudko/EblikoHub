import PushPinIcon from '@mui/icons-material/PushPin';
import GroupIcon from '@mui/icons-material/Group';
import type { RoomShort } from "~/entities/room/model/room.types";
import { useRoomActions } from '../../hooks/useRoomActions';

interface RoomCardProps {
    room: RoomShort;
    onClick?: () => void;
}

const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";

export const RoomCard = ({ room, onClick }: RoomCardProps) => {
    const { pinRoom, isPending } = useRoomActions(room.roomId);

    return (
        <div onClick={onClick} className="group flex flex-col w-full rounded-2xl border border-border bg-card transition-all hover:border-primary cursor-pointer">
            <div className="relative h-40 w-full overflow-hidden hover:scale-[1.3] hover:z-10 duration-500 transition-transform hover:translate-y-5 ">
                <img src={room.imageUrl || DEFAULT_IMAGE_PATH} alt={room.roomName} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex flex-col gap-2">
                <h3 className="text-lg font-bold text-foreground truncate">{room.roomName}</h3>

                <div className="flex items-center justify-between text-foreground-muted text-sm">

                    <div className="flex items-center gap-1.5">
                        <GroupIcon sx={{ fontSize: 18, color: 'var(--foreground)' }} />
                        <span>{room.usersCount} members</span>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); pinRoom(); }}
                        disabled={isPending}
                        className="flex items-center justify-center p-1 rounded-lg hover:bg-background-muted transition-colors"
                    >
                        <PushPinIcon sx={{ color: 'var(--foreground)', fontSize: 18 }} />
                    </button>
                </div>
            </div>
        </div>
    );
};