import { useOutletContext } from "react-router";
import type { Room } from "~/entities/room/model/room.types";
import { SentInvitesTab } from "~/widgets/RoomSettingInvites";

export default function RoomSettingsSentInvitesPage() {
  const { room } = useOutletContext<{ room: Room }>();
  return <SentInvitesTab roomId={room.roomId} />;
}