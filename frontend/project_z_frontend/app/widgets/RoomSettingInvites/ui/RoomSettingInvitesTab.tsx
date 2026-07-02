
import { NavLink, useParams } from "react-router";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import OutboxIcon from "@mui/icons-material/Outbox";
import { RoomSettingInvitesWrapper } from "../RoomSettingInvitesWrapper";
import type { Room } from "~/entities/room/model/room.types";
import type { ReactNode } from "react";

interface RoomSettingInvitesTabProps {
  room: Room;
  role: string;
  children: ReactNode; // Приймаємо вкладений роут як children
}

export const RoomSettingInvitesTab = ({ room, role, children }: RoomSettingInvitesTabProps) => {
  const { id: roomId } = useParams();

  // Базовий шлях для посилань у табах
  const baseUrl = `/rooms/${roomId}/settings/invites`;

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
          Room Management
        </span>
        <h1 className="text-2xl font-bold text-white">{room?.roomName || "Invites"}</h1>
      </div>

      {/* Перемикач табів через NavLink — посилання автоматично підсвічуються активними */}
      <div className="flex gap-2 bg-[#1a1a1a] p-1.5 rounded-2xl border border-neutral-800 w-fit">
        <NavLink
          to={`${baseUrl}/find`}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "bg-amber-500 text-black shadow-lg font-semibold"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`
          }
        >
          <PersonSearchIcon sx={{ fontSize: 18 }} />
          Find User
        </NavLink>

        <NavLink
          to={`${baseUrl}/requests`}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "bg-amber-500 text-black shadow-lg font-semibold"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`
          }
        >
          <GroupAddIcon sx={{ fontSize: 18 }} />
          Join Requests
        </NavLink>

        <NavLink
          to={`${baseUrl}/sent`}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "bg-amber-500 text-black shadow-lg font-semibold"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`
          }
        >
          <OutboxIcon sx={{ fontSize: 18 }} />
          Sent
        </NavLink>
      </div>

      {/* Рендеримо сюди поточну активну сторінку роуту */}
      <RoomSettingInvitesWrapper>
        {children}
      </RoomSettingInvitesWrapper>
    </div>
  );
};