import { useParams } from "react-router";
import { useRoomDetails } from "~/entities/room";
import { useAuthStore } from "~/features/auth";
import { ErrorScreen } from "~/shared/ui/ErrorScreen";
import { RoomMembersTab } from "~/widgets/RoomMembersTab";

export default function RoomsSettingsMembersPage() {
  const { id: roomId } = useParams<{ id: string }>();
  const { userId } = useAuthStore();

  const { room, isLoading: isRoomLoading, isError } = useRoomDetails(Number(roomId));

  // Чекаємо тільки завантаження деталей кімнати
  if (isRoomLoading) {
    return <div className="p-10 text-muted-foreground font-semibold">Loading settings...</div>;
  }

  if (!room || isError) {
    return (
      <ErrorScreen
        title="Settings unavailable"
        message="Room not found."
      />
    );
  }

  return (
    <RoomMembersTab
      room={room}
      currentUserId={userId || ""}
    />
  );
}