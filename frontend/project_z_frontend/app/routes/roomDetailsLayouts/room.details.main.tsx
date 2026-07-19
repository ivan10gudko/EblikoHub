import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useRoomDetails } from "~/entities/room";
import { RoomDetailsSidebar, RoomModalManager, useRoomTitlesQuery } from "~/features/manageRooms";
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
       
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto min-h-[calc(100vh-64px)] bg-background-muted/30">
            
           
            <div className="w-full lg:w-auto flex flex-col">
                <RoomDetailsSidebar room={room} />
            </div>

            
            <RoomModalManager roomId={Number(roomId)} />
        </div>
    );
}