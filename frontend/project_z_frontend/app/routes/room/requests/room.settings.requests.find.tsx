import { useOutletContext } from "react-router";
import type { Room } from "~/entities/room/model/room.types";
import { FindUserTab } from "~/widgets/RoomSettingInvites";

export default function RoomSettingsRequestsFindPage() {
  const { room } = useOutletContext<{ room: Room }>();
  
  return <FindUserTab roomId={room.roomId} />;
}