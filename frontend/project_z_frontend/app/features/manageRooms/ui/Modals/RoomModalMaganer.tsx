
import { useRoomModalStore } from "~/entities/room";
import { AddRoomModal } from "~/features/manageRooms";


export const RoomModalManager = () => {
  const { activeRoomId, type, close } = useRoomModalStore();

  return (
      <AddRoomModal 
        isOpen={type === 'add'} 
        onClose={close} 
      />
  );
};