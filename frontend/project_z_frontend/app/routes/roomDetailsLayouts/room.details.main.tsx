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
        return <div className="p-10 text-foreground bg-background min-h-screen">Loading room...</div>;
    }

    return (
        
        <div className="flex flex-col lg:flex-row gap-6 p-5 sm:p-8 max-w-[1400px] mx-auto min-h-screen bg-background-muted/30">
            
            <RoomDetailsSidebar room={room} />
            
        </div>
    );
}