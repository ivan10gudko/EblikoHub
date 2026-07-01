import { RoomRole, type Room } from "~/entities/room";
import { RoomSettingGeneralReadOnlyTab } from "./RoomSettingReadOnlyTab";
import { RoomSettingGeneralTab } from "./roomSettingGeneralTab";
interface RoomSettingGeneralTabProps {
    room: Room;
    role: RoomRole
}

export const RoomSettingGeneralWrapper = ({ room, role }: RoomSettingGeneralTabProps) => {
    if (role == RoomRole.MEMBER) return <RoomSettingGeneralReadOnlyTab room={room} />
    return <RoomSettingGeneralTab room={room} />
}