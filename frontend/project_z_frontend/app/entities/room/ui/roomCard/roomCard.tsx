import PushPinIcon from "@mui/icons-material/PushPin";
import GroupIcon from "@mui/icons-material/Group";
import type { RoomShort } from "~/entities/room/model/room.types";
import { useRoomActions } from "../../hooks/useRoomActions";
import { RoomActionsMenu } from "../roomActoinsMenu";
interface RoomCardProps {
  room: RoomShort;
  onClick?: () => void;
}

const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";

export const RoomCard = ({ room, onClick }: RoomCardProps) => {
  const { pinRoom, isPending } = useRoomActions(room.roomId);
  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    pinRoom();
  };

  return (
    <div
      onClick={onClick}
      className="group flex flex-col w-full rounded-2xl border border-border bg-card transition-all hover:border-primary cursor-pointer"
    >
      <div className="relative h-40 w-full overflow-hidden rounded-t-2xl hover:scale-[1.3] hover:z-10 duration-500 transition-transform hover:translate-y-5 ">
        <img
          src={room.imageUrl || DEFAULT_IMAGE_PATH}
          alt={room.roomName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-foreground truncate">
          {room.roomName}
        </h3>

        <div className="flex items-center justify-between text-foreground-muted text-sm">
          <div className="flex items-center gap-1.5">
            <GroupIcon className="text-sm text-foreground" />
            <span>{room.usersCount} members</span>
          </div>

          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handlePin}
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
