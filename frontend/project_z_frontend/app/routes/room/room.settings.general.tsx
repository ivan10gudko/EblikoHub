import { useParams } from "react-router";
import { useRoomDetails } from "~/entities/room";
import { useAuthStore } from "~/features/auth";
import { useRoomMemberByRoomIdAndUserId } from "~/features/manageRoomMembers";
import { ErrorScreen } from "~/shared/ui/ErrorScreen";
import { RoomSettingGeneralWrapper } from "~/widgets/roomSettingGeneralTab";

export default function RoomsSettingsGeneralPage() {
  const { id: roomId } = useParams<{ id: string }>();
  const { userId } = useAuthStore();

  const { data: roomMember, isLoading: isMemberLoading } =
    useRoomMemberByRoomIdAndUserId(userId!, Number(roomId));
  const { room, isLoading: isRoomLoading } = useRoomDetails(Number(roomId));

  if (isMemberLoading || isRoomLoading) {
    return <div className="p-10 text-muted-foreground font-semibold">Loading settings...</div>;
  }
  if (!room || !roomMember) {
    return (
      <ErrorScreen
        title="Settings unavailable"
        message="Room not found or you don't have permission to access these settings."
      />
    );
  }
  return (
    <RoomSettingGeneralWrapper
      room={room}
      role={roomMember.role}
    />
  );
}