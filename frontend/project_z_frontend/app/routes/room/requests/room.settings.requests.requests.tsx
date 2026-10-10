import { useOutletContext } from "react-router";
import type { Room } from "~/entities/room/model/room.types";
import { JoinRequestsTab } from "~/widgets/RoomSettingInvites";

export default function RoomSettingsJoinRequestsPage() {
  const { room } = useOutletContext<{ room: Room }>();
  return <JoinRequestsTab roomId={room.roomId} />;
}