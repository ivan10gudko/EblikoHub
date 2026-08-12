import type { RoomShort } from "../../model/room.types";
import { PinnedRoomCard } from "./pinnedRoomCard";
import { RoomCard } from "./roomCard";

interface RoomCardProps {
    room: RoomShort;
    onClick?: () => void;
    renderActions?: (room: RoomShort) => React.ReactNode;
}

export const RoomCardWrapper = ({ room, onClick, renderActions }: RoomCardProps) => {
    if (room.isPinned) {
        return <PinnedRoomCard room={room} onClick={onClick} renderActions={renderActions} />;
    }
    return <RoomCard room={room} onClick={onClick} renderActions={renderActions} />;
};