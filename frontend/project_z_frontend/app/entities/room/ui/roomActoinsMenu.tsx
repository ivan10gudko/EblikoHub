
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Dropdown } from '~/shared/ui/DropDown';
import { DropdownItem } from '~/shared/ui/DropDown/DropDown';
import type { RoomShort } from "../model/room.types";
import { useRemoveRoomMutation } from "../hooks/useRemoveRoomMutation";
import { useState } from "react";
interface RoomActionsMenuProps {
    room: RoomShort;
}
export const RoomActionsMenu = ({ room }: RoomActionsMenuProps) => {
  const { mutate: handleAction } = useRemoveRoomMutation(room.roomId, room.isOwner);
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dropdown trigger={
        <div className="p-1 hover:bg-background-muted rounded-lg transition-colors text-foreground-muted hover:text-foreground">
          <MoreHorizIcon fontSize="small" />
        </div>
      }>
        
        <DropdownItem 
          icon={<DeleteOutlineIcon fontSize="small" />} 
          onClick={(e) => {
            e.preventDefault();
            if (!isConfirming) {
              setIsConfirming(true);
            } else {
              handleAction();
            }
          }}
          variant="danger"
        >
          {isConfirming ? "Are you sure?" : (room.isOwner ? "Delete Room" : "Leave Room")}
        </DropdownItem>
      </Dropdown>
    </div>
  );
};