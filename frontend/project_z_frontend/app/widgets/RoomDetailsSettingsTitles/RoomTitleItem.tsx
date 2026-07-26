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
    <div className={`relative flex items-center justify-between p-3 rounded-lg border transition-all ${themeClass}`}>
      <div className="flex items-center gap-3">
        <img 
          src={item.imageUrl || defaultImagePath} 
          alt={item.titleName} 
          className="w-26 h-16 object-cover rounded-md" 
        />
        <div>
          <p className="font-medium text-foreground">{item.titleName}</p>
          <p className="text-xs text-muted-foreground">
            Added: {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <RoomTitleActionMenu 
        item={item}
        roomId={roomId}
        onDelete={() => onDelete(item.id)}
        canManage={canManage}
      />
    </div>
  );
};