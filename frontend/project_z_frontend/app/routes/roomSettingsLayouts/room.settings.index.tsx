import { Outlet, redirect, useParams } from "react-router";
import { useRoomDetails } from "~/entities/room";
import { useAuthStore } from "~/features/auth";
import { RoomModalManager, useRoomMemberByRoomIdAndUserId } from "~/features/manageRooms";
import { ErrorScreen } from "~/shared/ui/ErrorScreen";
import { RoomSettingsSidebar } from "~/widgets/RoomDetailsSettingsSidebar";


export default function RoomsSettingsIndexLayout() {
    const { id: roomId } = useParams<{ id: string }>();
    if (!roomId) return <ErrorScreen title="Not found" message="Room with that id not found" />;

    const { userId } = useAuthStore();
    if (!userId) return redirect("/auth/login");

    const { data: roomMember, isLoading: isMemberLoading } = useRoomMemberByRoomIdAndUserId(userId, Number(roomId));
    const { room, isLoading: isRoomLoading } = useRoomDetails(Number(roomId));


    if (isMemberLoading || isRoomLoading || !roomMember || !room) {
        return <div className="p-10">Loading settings...</div>;
    }

    return (
        <div className="flex flex-col md:flex-rowflex flex-col lg:flex-row gap-6 p-4 sm:p-8 max-w-[1400px] mx-auto min-h-screen bg-background-muted/30 gap-4 md:gap-6 p-4 md:p-6 min-h-[calc(100vh-64px)]">
            <RoomSettingsSidebar
                roomId={Number(roomId)}
                role={roomMember.role}
            />
            <main className="flex-1 w-full flex flex-col pt-5">
                <div className="w-full">
                    <Outlet />
                </div>
            </main>
            <RoomModalManager roomId={Number(roomId)} />
        </div>
    );
}