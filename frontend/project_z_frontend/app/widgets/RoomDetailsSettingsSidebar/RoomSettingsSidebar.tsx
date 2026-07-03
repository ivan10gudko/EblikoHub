import { useState, useEffect, type ElementType } from "react";
import { NavLink, useNavigate, useLocation } from "react-router";
import SettingsIcon from "@mui/icons-material/Settings";
import ListIcon from "@mui/icons-material/List";
import PeopleIcon from "@mui/icons-material/People";
import MailIcon from "@mui/icons-material/Mail";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import OutboxIcon from "@mui/icons-material/Outbox";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LinkIcon from "@mui/icons-material/Link";

import { Sidebar } from "~/shared/ui/Sidebar";
import { Button } from "~/shared/ui/Button";
import { RoomRole } from "~/entities/room/model/room.types";
import { NavGroupItem, NavLinkItem } from "~/shared/ui/NavLinkItem";
import type { NavItem } from "~/shared/ui/NavLinkItem/NavLinkItem";


interface RoomSettingsSidebarProps {
  roomId: number;
  role: RoomRole;
}
export const RoomSettingsSidebar = ({ roomId, role }: RoomSettingsSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes("/invites")) setOpenSection("invites");
    else if (currentPath.includes("/titles")) setOpenSection("titles");
  }, [location.pathname]);

  const toggleSection = (key: string, defaultPath: string) => {
    if (openSection === key) {
      setOpenSection(null);
    } else {
      setOpenSection(key);
      navigate(defaultPath);
    }
  };

  const navLinks: NavItem[] = [
    { key: "general", label: "General", path: `/rooms/${roomId}/settings/general`, Icon: SettingsIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN, RoomRole.MEMBER] },
    {
      key: "titles", label: "Titles", Icon: ListIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN, RoomRole.MEMBER],
      children: [
        { label: "Room Titles", path: `/rooms/${roomId}/settings/titles`, Icon: EmojiEventsIcon, end: true },
        { label: "Title Links", path: `/rooms/${roomId}/settings/titles/titleLinks`, Icon: LinkIcon },
      ]
    },
    { key: "members", label: "Members", path: `/rooms/${roomId}/settings/members`, Icon: PeopleIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN, RoomRole.MEMBER] },
    {
      key: "invites", label: "Invites", Icon: MailIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN],
      children: [
        { label: "Find User", path: `/rooms/${roomId}/settings/invites`, Icon: PersonSearchIcon, end: true },
        { label: "Join Requests", path: `/rooms/${roomId}/settings/invites/requests`, Icon: GroupAddIcon },
        { label: "Sent", path: `/rooms/${roomId}/settings/invites/sent`, Icon: OutboxIcon },
      ]
    },
    { key: "admin", label: "Administration", path: `/rooms/${roomId}/settings/admin`, Icon: AdminPanelSettingsIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN] },
  ].filter(link => link.allowed.includes(role));

  return (
    <Sidebar className="hidden md:flex flex-col p-5 gap-3 h-[calc(100vh-40px)] ml-5 my-5 shrink-0 backdrop-blur-md rounded-3xl md:min-h-[calc(100vh-64px)] w-80">
      <nav className="flex flex-col gap-3.5">
        {navLinks.map((item) => (
          item.children ? (
            <NavGroupItem
              key={item.key}
              item={item}
              isOpen={openSection === item.key}
              isGroupActive={item.children!.some(child => location.pathname === child.path)}
              onToggle={() => toggleSection(item.key, item.children![0].path)}
            />
          ) : (
            <NavLinkItem key={item.key} item={item} />
          )
        ))}

        <Button onClick={() => navigate(`/rooms/${roomId}`)} className="flex items-center gap-4 w-full px-5 py-3.5 mt-2 rounded-xl border border-border/40 bg-background-muted/20 text-foreground/80 hover:bg-background-muted/60 hover:text-foreground hover:border-primary/50">
          <ArrowBackIcon className="text-primary/70" />
          <span>Back to Room</span>
        </Button>
      </nav>
    </Sidebar>
  );
};