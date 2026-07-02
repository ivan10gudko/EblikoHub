import { useParams } from "react-router";
import { useRoomDetails } from "~/entities/room";
import { useAuthStore } from "~/features/auth";
import { useRoomMemberByRoomIdAndUserId } from "~/features/manageRooms";

import { RoomMembersTab } from "~/widgets/RoomMembersTab";

export default function RoomsSettingsMembersPage() {
    const { id: roomId } = useParams<{ id: string }>();
    const { userId } = useAuthStore();

    const { data: roomMember, isLoading: isMemberLoading } = useRoomMemberByRoomIdAndUserId(userId!, Number(roomId));
    const { room, isLoading: isRoomLoading } = useRoomDetails(Number(roomId));

    if (isMemberLoading || isRoomLoading || !roomMember || !room) {
        return <div className="p-10">Loading settings...</div>;
    }

    return (
        <RoomMembersTab
            room={room}
            currentUserId={userId!}
        />
    );
}