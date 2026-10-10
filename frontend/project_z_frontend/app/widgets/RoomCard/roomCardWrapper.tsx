import { useNavigate } from "react-router";
import type { RoomShort } from "../../entities/room/model/room.types";
import { PinnedRoomCard } from "./pinnedRoomCard";
import { RoomCard } from "./roomCard";

interface RoomCardProps {
    room: RoomShort;
}

export const RoomCardWrapper = ({ room}: RoomCardProps) => {
    const navigate = useNavigate();
    const onClick = () => navigate(`/rooms/${room.roomId}`);
    if (room.isPinned) {
        return <PinnedRoomCard room={room} onClick={onClick} />;
    }
    return <RoomCard room={room} onClick={onClick} />;
};