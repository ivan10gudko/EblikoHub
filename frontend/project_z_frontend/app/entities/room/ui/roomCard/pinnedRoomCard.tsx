
import type { RoomShort } from "../../model/room.types";
import GroupIcon from "@mui/icons-material/Group";

interface RoomCardProps {
  room: RoomShort;
  onClick?: () => void;
  renderActions?: (room: RoomShort) => React.ReactNode;
}
const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";

export const PinnedRoomCard = ({ room, onClick, renderActions }: RoomCardProps) => {  return (
    <div
      onClick={onClick}
      className="group flex flex-col w-full rounded-2xl border-2 border-primary bg-card shadow-lg shadow-primary/10 transition-all cursor-pointer"
    >
     
      <div className="relative h-44 w-full overflow-hidden rounded-t-[14px] origin-top duration-500 transition-all">
        <img
          src={room.imageUrl || DEFAULT_IMAGE_PATH}
          alt={room.roomName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col gap-2 bg-gradient-to-b from-primary/5 to-transparent">
        <h3 className="text-lg font-bold text-primary truncate">
          {room.roomName}
        </h3>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-foreground text-sm font-medium">
            <GroupIcon className="text-sm text-foreground" />
            <span className="text-primary">{room.usersCount} members</span>
          </div>

          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {renderActions?.(room)}
          </div>
        </div>
      </div>
    </div>
  );
};