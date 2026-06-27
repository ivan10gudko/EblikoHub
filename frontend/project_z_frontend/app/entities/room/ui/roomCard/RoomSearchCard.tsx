import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button } from "~/shared/ui/Button";
import type { RoomSearchResult } from "../../model/room.types";
import { useRoomRequests } from "../../hooks/useRoomRequests";

interface RoomSearchCardProps {
  room: RoomSearchResult;
}

const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";

export const RoomSearchCard = ({ room }: RoomSearchCardProps) => {
  const { joinRoom, isJoining } = useRoomRequests(room.roomId);

  const getButtonContent = () => {
    if (room.isMember) return { icon: <CheckCircleIcon fontSize="small" />, text: "Joined" };
    if (room.isRequested) return { icon: <CheckCircleIcon fontSize="small" />, text: "Requested" };
    return { icon: <PersonAddIcon fontSize="small" />, text: "Join" };
  };
  const isDisabled = room.isMember || room.isRequested || isJoining;
  const { icon, text } = getButtonContent();
  return (
    <div className="group flex flex-col w-full border border-border bg-card transition-all hover:border-primary">
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={room.imageUrl || DEFAULT_IMAGE_PATH}
          alt={room.roomName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-3 flex flex-col gap-3">
        <h3 className="text-md font-bold text-foreground truncate">{room.roomName}</h3>

        <div className="flex flex-col gap-3">

          <div className="flex items-center gap-1.5 text-foreground-muted text-xs">
            <GroupIcon className="text-sm shrink-0" />
            <span className="truncate">{room.memberCount} members</span>
          </div>

          <Button
            onClick={() => joinRoom()}
            disabled={isDisabled}
            className="h-9 w-full text-xs flex items-center justify-center gap-1.5"
          >
            {icon}
            {text}
          </Button>
        </div>
      </div>
    </div>
  );
};