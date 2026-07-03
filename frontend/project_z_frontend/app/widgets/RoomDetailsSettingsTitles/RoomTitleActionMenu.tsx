import { useState } from "react";
import { MoreVert, Link as LinkIcon, Edit } from "@mui/icons-material";
import { Dropdown } from "~/shared/ui/DropDown";
import { DropdownItem, DeleteDropdownItem } from "~/shared/ui/DropDown/DropDown";
import { ViewLinksModal } from "./ViewLinksModal";
import { EditRoomTitleModal } from "./EditRoomTitleModal";
import type { RoomTitleDetails } from "~/features/manageRooms/model/roomTitle.types";

interface RoomTitleActionMenuProps {
  item: RoomTitleDetails;
  roomId: number;
  onDelete: () => void;
  canManage: boolean;
}

export const RoomTitleActionMenu = ({ 
  item,
  roomId, 
  onDelete, 
  canManage 
}: RoomTitleActionMenuProps) => {
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <Dropdown
        align="end"
        trigger={
          <div className="p-1.5 hover:bg-border/50 rounded-lg transition-colors text-foreground/50 hover:text-foreground cursor-pointer">
            <MoreVert sx={{ fontSize: 20 }} />
          </div>
        }
      >
        <DropdownItem 
          onClick={() => setIsLinksModalOpen(true)} 
          icon={<LinkIcon sx={{ fontSize: 16 }} />}
        >
          View Links
        </DropdownItem>
        
        {canManage && (
          <>
            <DropdownItem 
              onClick={() => setIsEditModalOpen(true)} 
              icon={<Edit sx={{ fontSize: 16 }} />}
            >
              Edit
            </DropdownItem>
            <div className="h-px bg-border my-1" />
            <DeleteDropdownItem onDelete={onDelete} />
          </>
        )}
      </Dropdown>

      <ViewLinksModal 
        isOpen={isLinksModalOpen} 
        onClose={() => setIsLinksModalOpen(false)} 
        roomId={roomId} 
        roomTitleId={item.id} 
      />

      <EditRoomTitleModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        roomId={roomId}
        item={item}
      />
    </>
  );
};