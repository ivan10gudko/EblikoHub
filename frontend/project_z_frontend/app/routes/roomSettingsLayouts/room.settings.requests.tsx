import { useParams, Outlet } from "react-router";
import { useRoomDetails } from "~/entities/room";
import { useAuthStore } from "~/features/auth";
import { useRoomMemberByRoomIdAndUserId } from "~/features/manageRooms";
import { RoomSettingInvitesTab } from "~/widgets/RoomSettingInvites/ui/RoomSettingInvitesTab";

export default function RoomSettingsRequestsPage() {
    const { id: roomId } = useParams<{ id: string }>();
    const { userId } = useAuthStore();

    const { data: roomMember, isLoading: isMemberLoading } = useRoomMemberByRoomIdAndUserId(userId!, Number(roomId));
    const { room, isLoading: isRoomLoading } = useRoomDetails(Number(roomId));

    if (isMemberLoading || isRoomLoading || !roomMember || !room) {
        return <div className="p-10 text-white">Loading settings...</div>;
    }

    return (
       
        <Outlet context={{ room, role: roomMember.role }} />
        
    );
}