import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useRoomDetails } from "~/entities/room";
import { RoomDetailsSidebar, useRoomTitlesQuery } from "~/features/manageRooms";
import { useRoomDetailsFilterStore } from "~/features/manageRooms/store/roomDetailsFilter.store";


export default function RoomDetailsMainPage() {
    const { id: roomId } = useParams<{ id: string }>();

    const { setMembers } = useRoomDetailsFilterStore();
    const prevRoomId = useRef<string | undefined>(undefined);

    useEffect(() => {

        if (roomId && prevRoomId.current !== roomId) {
            setMembers([]);
        }
        prevRoomId.current = roomId;
    }, [roomId, setMembers]);
    const { room, isLoading } = useRoomDetails(Number(roomId));
    const { data } = useRoomTitlesQuery(Number(roomId));
    if (isLoading || !room) {
        return <div className="p-10">Loading room...</div>;
    }

    return (
        <RoomDetailsSidebar room={room} />
    );
}