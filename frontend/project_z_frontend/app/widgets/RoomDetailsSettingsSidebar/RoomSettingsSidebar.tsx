import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router";
import SettingsIcon from "@mui/icons-material/Settings";
import ListIcon from "@mui/icons-material/List";
import PeopleIcon from "@mui/icons-material/People";
import MailIcon from "@mui/icons-material/Mail";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import OutboxIcon from "@mui/icons-material/Outbox";

import { Sidebar } from "~/shared/ui/Sidebar";
import { Button } from "~/shared/ui/Button";
import { RoomRole } from "~/entities/room/model/room.types";

const getLinkClass = (isActive: boolean) =>
  `flex items-center gap-4 px-5 py-3.5 rounded-xl font-medium transition-all duration-300 border backdrop-blur-sm w-full ${
    isActive
      ? "bg-primary text-background border-primary shadow-[0_0_14px_rgba(251,146,6,0.35)] font-bold translate-x-1"
      : "text-foreground/80 border-border/40 bg-background-muted/20 hover:bg-background-muted/60 hover:text-foreground hover:border-primary/50 hover:translate-x-1"
  }`;

const getSubLinkClass = (isActive: boolean) =>
  `flex items-center gap-3.5 px-5 py-2 rounded-xl font-medium transition-all duration-200 border w-full ${
    isActive
      ? "bg-primary/10 text-primary border-primary/30 font-semibold"
      : "text-foreground/70 border-transparent hover:bg-background-muted/40 hover:text-foreground"
  }`;

interface RoomSettingsSidebarProps {
  roomId: number;
  role: RoomRole;
}

export const RoomSettingsSidebar = ({ roomId, role }: RoomSettingsSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isInvitesActive = location.pathname.includes(`/rooms/${roomId}/settings/invites`);
  const [isInvitesOpen, setIsInvitesOpen] = useState(isInvitesActive);

  useEffect(() => {
    if (isInvitesActive) {
      setIsInvitesOpen(true);
    }
  }, [location.pathname, isInvitesActive]);

  const navLinks = [
    { key: "general", label: "General", path: `/rooms/${roomId}/settings/general`, Icon: SettingsIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN, RoomRole.MEMBER] },
    { key: "titles", label: "Titles", path: `/rooms/${roomId}/settings/titles`, Icon: ListIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN, RoomRole.MEMBER] },
    { key: "members", label: "Members", path: `/rooms/${roomId}/settings/members`, Icon: PeopleIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN, RoomRole.MEMBER] },
    { key: "admin", label: "Administration", path: `/rooms/${roomId}/settings/admin`, Icon: AdminPanelSettingsIcon, allowed: [RoomRole.OWNER] },
  ].filter(link => link.allowed.includes(role));

  const hasInvitesAccess = [RoomRole.OWNER, RoomRole.ADMIN].includes(role);

  const handleInvitesToggle = () => {
    if (isInvitesOpen && isInvitesActive) {
      setIsInvitesOpen(false);
    } else {
      setIsInvitesOpen(true);
      navigate(`/rooms/${roomId}/settings/invites`);
    }
  };

  return (
    <Sidebar className="hidden md:flex flex-col p-5 gap-3 h-[calc(100vh-40px)] ml-5 my-5 shrink-0 backdrop-blur-md rounded-3xl md:min-h-[calc(100vh-64px)] w-80">
      <nav className="flex flex-col gap-3.5">
        
        {/* Рендеримо перші 3 вкладки */}
        {navLinks.slice(0, 3).map(({ key, label, path, Icon }) => (
          <NavLink key={key} to={path} className={({ isActive }) => getLinkClass(isActive)}>
            {({ isActive }) => (
              <span className="flex items-center gap-4 w-full">
                <Icon className={isActive ? "scale-110 opacity-90" : "text-primary scale-110 opacity-90"} />
                <span className="text-lg tracking-wide">{label}</span>
              </span>
            )}
          </NavLink>
        ))}

        {/* БЛОК INVITES З КОМПАКТНИМИ ПІДПУНКТАМИ */}
        {hasInvitesAccess && (
          <div className="flex flex-col gap-1 w-full">
            <button
              type="button"
              onClick={handleInvitesToggle}
              className={getLinkClass(isInvitesActive)}
            >
              <span className="flex items-center justify-between w-full">
                <span className="flex items-center gap-4">
                  <MailIcon className={isInvitesActive ? "scale-110 opacity-90" : "text-primary scale-110 opacity-90"} />
                  <span className="text-lg tracking-wide">Invites</span>
                </span>
                <KeyboardArrowDownIcon 
                  className={`transition-transform duration-300 ${isInvitesOpen ? "rotate-180" : ""}`} 
                />
              </span>
            </button>

            {/* Компактне випадаюче меню */}
            <div 
              className={`grid transition-all duration-300 ease-in-out pl-4 flex-col gap-1 overflow-hidden ${
                isInvitesOpen ? "grid-rows-[1fr] opacity-100 mt-1.5" : "grid-rows-[0fr] opacity-0 pointer-events-none"
              }`}
            >
              <div className="overflow-hidden flex flex-col gap-1">
                
                {/* 1. Find User — Тепер веде на базову index-адресу без /find */}
                <NavLink 
                  to={`/rooms/${roomId}/settings/invites`} 
                  end
                  className={({ isActive }) => getSubLinkClass(isActive)}
                >
                  {() => (
                    <span className="flex items-center gap-3.5 w-full">
                      <PersonSearchIcon className="text-primary scale-105 opacity-90" />
                      <span className="text-sm tracking-wide">Find User</span>
                    </span>
                  )}
                </NavLink>

                {/* 2. Join Requests */}
                <NavLink to={`/rooms/${roomId}/settings/invites/requests`} className={({ isActive }) => getSubLinkClass(isActive)}>
                  {() => (
                    <span className="flex items-center gap-3.5 w-full">
                      <GroupAddIcon className="text-primary scale-105 opacity-90" />
                      <span className="text-sm tracking-wide">Join Requests</span>
                    </span>
                  )}
                </NavLink>

                {/* 3. Sent */}
                <NavLink to={`/rooms/${roomId}/settings/invites/sent`} className={({ isActive }) => getSubLinkClass(isActive)}>
                  {() => (
                    <span className="flex items-center gap-3.5 w-full">
                      <OutboxIcon className="text-primary scale-105 opacity-90" />
                      <span className="text-sm tracking-wide">Sent</span>
                    </span>
                  )}
                </NavLink>
                
              </div>
            </div>
          </div>
        )}

        {/* Рендеримо решту лінків */}
        {navLinks.slice(3).map(({ key, label, path, Icon }) => (
          <NavLink key={key} to={path} className={({ isActive }) => getLinkClass(isActive)}>
            {({ isActive }) => (
              <span className="flex items-center gap-4 w-full">
                <Icon className={isActive ? "scale-110 opacity-90" : "text-primary scale-110 opacity-90"} />
                <span className="text-lg tracking-wide">{label}</span>
              </span>
            )}
          </NavLink>
        ))}

        {/* Кнопка Back to Room */}
        <Button
          onClick={() => navigate(`/rooms/${roomId}`)}
          className="flex items-center gap-4 w-full px-5 py-3.5 mt-2 rounded-xl border border-border/40 bg-background-muted/20 text-foreground/80 hover:bg-background-muted/60 hover:text-foreground hover:border-primary/50"
        >
          <ArrowBackIcon className="text-primary/70" />
          <span>Back to Room</span>
        </Button>
      </nav>
    </Sidebar>
  );
};