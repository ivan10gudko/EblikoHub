import { Outlet, useParams } from "react-router";
import { useRoomDetails } from "~/entities/room";
import { useAuthStore } from "~/features/auth";
import { useRoomMemberByRoomIdAndUserId } from "~/features/manageRoomMembers";
import { ErrorScreen } from "~/shared/ui/ErrorScreen";
import { ResponsiveSidebar } from "~/shared/ui/ResponsiveSidebar";
import { RoomSettingsSidebar } from "~/widgets/RoomDetailsSettingsSidebar";

export default function RoomsSettingsIndexLayout() {
  const { id } = useParams<{ id: string }>();
  const roomId = id ? Number(id) : undefined;

  if (!roomId) return <ErrorScreen title="Not found" message="Room with that id not found" />;

  const { userId } = useAuthStore();

  const { data: roomMember, isLoading: isMemberLoading } = useRoomMemberByRoomIdAndUserId(userId!, roomId);
  const { room, isLoading: isRoomLoading } = useRoomDetails(roomId);

  if (isMemberLoading || isRoomLoading) {
    return <div className="p-10 text-foreground font-semibold">Loading settings...</div>;
  }

  if (!room) {
    return <ErrorScreen title="Access Denied" message="Room not found." />;
  }

  return (
    <ResponsiveSidebar
      menuButtonLabel="Settings Navigation"
      sidebar={
        <RoomSettingsSidebar
          roomId={roomId}
          role={roomMember?.role}
        />
      }
    >
      <Outlet />
    </ResponsiveSidebar>
  );
}