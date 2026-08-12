import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button } from "~/shared/ui/Button";
import type { RoomSearchResult } from "../../model/room.types";

interface RoomSearchCardProps {
  room: RoomSearchResult;
  onClick?: () => void;
  onJoin?: () => void;
  isJoining?: boolean;
  renderActions?: (room: RoomSearchResult) => React.ReactNode;
}

const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";

export const RoomSearchCard = ({
  room,
  onClick,
  onJoin,
  isJoining = false,
  renderActions,
}: RoomSearchCardProps) => {
  const getButtonContent = () => {
    if (room.isMember) return { icon: <CheckCircleIcon fontSize="small" />, text: "Joined" };
    if (room.isRequested) return { icon: <CheckCircleIcon fontSize="small" />, text: "Requested" };
    return { icon: <PersonAddIcon fontSize="small" />, text: "Join" };
  };

  const isDisabled = room.isMember || room.isRequested || isJoining;
  const { icon, text } = getButtonContent();

  const handleJoin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onJoin?.();
  };

  return (
    <div
      onClick={onClick}
      className="group flex flex-col w-full rounded-2xl border border-border bg-card transition-all hover:border-primary cursor-pointer overflow-hidden"
    >
      <div className="relative h-50 md:h-44 w-full overflow-hidden origin-top duration-500 transition-all">
        <img
          src={room.imageUrl || DEFAULT_IMAGE_PATH}
          alt={room.roomName}
          className="w-full h-full object-cover transition-transform duration-300"
        />
      </div>

      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
          {room.roomName}
        </h3>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-foreground-muted text-sm">
            <div className="flex items-center gap-1.5">
              <GroupIcon className="text-sm text-foreground shrink-0" />
              <span className="truncate">{room.memberCount} members</span>
            </div>

            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {renderActions?.(room)}
            </div>
          </div>

          <Button
            variant="fill"
            onClick={handleJoin}
            disabled={isDisabled}
            className="h-9 w-full text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {icon}
            {text}
          </Button>
        </div>
      </div>
    </div>
  );
};