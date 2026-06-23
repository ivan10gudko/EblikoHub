import type { RoomShort } from "../../model/room.types";
import { PinnedRoomCard } from "./pinnedRoomCard";
import { RoomCard } from "./roomCard";

interface RoomCardProps {
    room: RoomShort;
    onClick?: () => void;
}

export const RoomCardWrapper = ({ room, onClick }: RoomCardProps) => {
    if (room.isPinned) {
        return <PinnedRoomCard room={room} onClick={onClick} />;
    }
    return <RoomCard room={room} onClick={onClick} />;
};