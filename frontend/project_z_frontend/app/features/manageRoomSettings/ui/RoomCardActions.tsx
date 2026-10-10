import React from "react";
import PushPinIcon from "@mui/icons-material/PushPin";
import { RoomActionsMenu } from "./RoomActionsMenu";
import type { RoomShort } from "~/entities/room";
import { useRoomActions } from "../hooks/useRoomPinActions";

interface RoomCardActionsProps {
  room: RoomShort;
}

export const RoomCardActions = ({ room }: RoomCardActionsProps) => {
  const { pinRoom, unpinRoom, isPending } = useRoomActions(room.roomId);

  const handlePinToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (room.isPinned) {
      unpinRoom();
    } else {
      pinRoom();
    }
  };

  return (
    <>
      <button
        onClick={handlePinToggle}
        disabled={isPending}
        className="flex items-center justify-center p-1 rounded-lg hover:bg-background-muted transition-colors"
      >
        <PushPinIcon className="text-sm text-foreground" />
      </button>

      <RoomActionsMenu room={room} />
    </>
  );
};
