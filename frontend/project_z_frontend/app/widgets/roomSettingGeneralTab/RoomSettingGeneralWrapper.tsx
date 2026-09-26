import { RoomRole, type Room } from "~/entities/room";
import { RoomSettingGeneralReadOnlyTab } from "./RoomSettingReadOnlyTab";
import { RoomSettingGeneralTab } from "./roomSettingGeneralTab";
interface RoomSettingGeneralTabProps {
    room: Room;
    role: RoomRole | undefined;
}

export const RoomSettingGeneralWrapper = ({ room, role }: RoomSettingGeneralTabProps) => {
    if (role == RoomRole.MEMBER || role==undefined) return <RoomSettingGeneralReadOnlyTab room={room} />
    return <RoomSettingGeneralTab key={room.roomId} room={room} />
}