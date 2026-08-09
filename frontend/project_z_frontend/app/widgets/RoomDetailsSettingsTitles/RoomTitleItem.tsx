import type { RoomTitleDetails } from "~/features/manageRooms/model/roomTitle.types";
import { TitleTypeThemes } from "~/entities/titleRecord";
import { RoomTitleActionMenu } from "./RoomTitleActionMenu";

interface RoomTitleItemProps {
  item: RoomTitleDetails;
  onDelete: (id: string) => void;
  defaultImagePath: string;
  roomId: number;
  isCurrentUserAdmin: boolean;
  isOwn: boolean;
}

export const RoomTitleItem = ({ 
  item, 
  onDelete, 
  defaultImagePath, 
  roomId,
  isCurrentUserAdmin,
  isOwn
}: RoomTitleItemProps) => {
  
  const canManage = isOwn || isCurrentUserAdmin;

  
  const themeClass = TitleTypeThemes[item.titleType] || "border-border hover:border-foreground/30";

  return (
  <div
  className={`relative grid w-full max-w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 overflow-hidden p-3 rounded-lg border transition-all ${themeClass}`}
>
  <img
    src={item.imageUrl || defaultImagePath}
    alt={item.titleName}
   className="w-20 h-16 md:w-24 md:h-16 shrink-0 object-cover rounded-md"
  />

  <div className="min-w-0 overflow-hidden">
    <div className="truncate font-bold">
      {item.titleName}
    </div>

    <div className="truncate text-sm font-bold">
      Added: {new Date(item.createdAt).toLocaleDateString()}
    </div>
  </div>

  <div className="shrink-0">
    <RoomTitleActionMenu
      item={item}
      roomId={roomId}
      onDelete={() => onDelete(item.id)}
      canManage={canManage}
    />
  </div>
</div>
  );
};