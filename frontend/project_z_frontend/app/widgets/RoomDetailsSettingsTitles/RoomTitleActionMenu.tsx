
import { MoreVert, Link as LinkIcon, Edit } from "@mui/icons-material";
import { Dropdown } from "~/shared/ui/DropDown";
import { DropdownItem, DeleteDropdownItem } from "~/shared/ui/DropDown/DropDown";
import type { RoomTitleDetails } from "~/features/manageRooms/model/roomTitle.types";
import { useRoomModal } from "~/features/manageRooms/hooks/useRoomModal";

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
  const { openSettingsModal } = useRoomModal();
  const itemId = String(item.id);
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
        <DropdownItem onClick={() => openSettingsModal('all-links', itemId)} icon={<LinkIcon sx={{ fontSize: 16 }} />}>
          View Links
        </DropdownItem>

      {canManage && (
        <>
          <DropdownItem onClick={() => openSettingsModal('edit-title', itemId)} icon={<Edit sx={{ fontSize: 16 }} />}>
            Edit
          </DropdownItem>
          <div className="h-px bg-border my-1" />
          <DeleteDropdownItem onDelete={onDelete} />
        </>
      )}
    </Dropdown >

    </>
  );
};