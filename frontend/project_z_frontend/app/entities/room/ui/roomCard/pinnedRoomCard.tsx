import { useRoomActions } from "../../hooks/useRoomActions";
import type { RoomShort } from "../../model/room.types";
import PushPinIcon from "@mui/icons-material/PushPin";
import GroupIcon from "@mui/icons-material/Group";
import { RoomActionsMenu } from "../roomActoinsMenu";

interface RoomCardProps {
  room: RoomShort;
  onClick?: () => void;
}
const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";

export const PinnedRoomCard = ({ room, onClick }: RoomCardProps) => {
  const { unpinRoom, isPending } = useRoomActions(room.roomId);
  const handleUnpin = (e: React.MouseEvent) => {
    e.stopPropagation();
    unpinRoom();
  };

  return (
    <div
      onClick={onClick}
      className="group flex flex-col w-full rounded-2xl border-2 border-primary bg-card shadow-lg shadow-primary/10 transition-all cursor-pointer"
    >
      <div className="relative h-40 w-full overflow-hidden hover:scale-[1.3] hover:z-10 duration-500 rounded-t-[14px] transition-transform hover:translate-y-5">
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
            <button
              onClick={handleUnpin}
              disabled={isPending}
              className="flex items-center justify-center p-1 rounded-lg hover:bg-background-muted transition-colors"
            >
              <PushPinIcon className="text-sm text-foreground" />
            </button>

            <RoomActionsMenu room={room} />
          </div>
        </div>
      </div>
    </div>
  );
};
