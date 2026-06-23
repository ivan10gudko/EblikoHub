import { useNavigate } from "react-router";
import type { RoomShort } from "../model/room.types";
import { RoomCardWrapper } from "./roomCard/roomCardWrapper";

export const RoomListGrid = ({ rooms, isLoading, isEmpty }: { rooms: RoomShort[], isLoading: boolean, isEmpty: boolean }) => {
  const navigate = useNavigate();

  if (isLoading) return <div className="text-foreground">Loading rooms...</div>;
  if (isEmpty) return <div className="text-foreground-muted text-center py-20">No rooms found.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {rooms.map((room) => (
        <RoomCardWrapper 
          key={room.roomId} 
          room={room} 
          onClick={() => navigate(`/rooms/${room.roomId}`)} 
        />
      ))}
    </div>
  );
};