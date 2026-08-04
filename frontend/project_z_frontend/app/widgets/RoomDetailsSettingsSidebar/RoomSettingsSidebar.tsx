import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
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
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { Sidebar } from "~/shared/ui/Sidebar";
import { Button } from "~/shared/ui/Button";
import { RoomRole } from "~/entities/room/model/room.types";
import { NavGroupItem, NavLinkItem } from "~/shared/ui/NavLinkItem";
import type { NavItem } from "~/shared/ui/NavLinkItem/NavLinkItem";
import { useRoomModal } from "~/features/manageRooms/hooks/useRoomModal";

interface RoomSettingsSidebarProps {
  roomId: number;
  role: RoomRole;
  onCloseMobileMenu?: () => void;
}

export const RoomSettingsSidebar = ({ roomId, role, onCloseMobileMenu }: RoomSettingsSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSettingsModalOpen } = useRoomModal();
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes("/invites")) setOpenSection("invites");
    else if (currentPath.includes("/titles")) setOpenSection("titles");
  }, [location.pathname]);

  const handleItemClick = (path: string) => {
    navigate(path);
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  const toggleSection = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

 
  const handleNavClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!onCloseMobileMenu) return;

    const target = e.target as HTMLElement;

    
    const linkElement = target.closest('a');
    
   
    const isGroupHeader = target.closest('[class*="NavGroupItem"]') && !linkElement;

    
    if (linkElement && !isGroupHeader) {
      onCloseMobileMenu();
    }
  };

  const navLinks: NavItem[] = [
    { key: "general", label: "General", path: `/rooms/${roomId}/settings/general`, Icon: SettingsIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN, RoomRole.MEMBER] },
    {
      key: "titles", label: "Titles", Icon: ListIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN, RoomRole.MEMBER],
      children: [
        { key: "room-titles", label: "Room Titles", path: `/rooms/${roomId}/settings/titles`, Icon: EmojiEventsIcon, end: true, allowed: [RoomRole.OWNER, RoomRole.ADMIN, RoomRole.MEMBER] },
        { key: "title-links", label: "Title Links", path: `/rooms/${roomId}/settings/titles/titleLinks`, Icon: LinkIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN, RoomRole.MEMBER] },
        { key: "ai-matcher", label: "AI Title Matcher", path: `/rooms/${roomId}/settings/titles/ai-matcher`, Icon: AutoAwesomeIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN, RoomRole.MEMBER] },
      ]
    },
    { key: "members", label: "Members", path: `/rooms/${roomId}/settings/members`, Icon: PeopleIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN, RoomRole.MEMBER] },
    {
      key: "invites", label: "Invites", Icon: MailIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN],
      children: [
        { key: "find-user", label: "Find User", path: `/rooms/${roomId}/settings/invites`, Icon: PersonSearchIcon, end: true, allowed: [RoomRole.OWNER, RoomRole.ADMIN] },
        { key: "join-requests", label: "Join Requests", path: `/rooms/${roomId}/settings/invites/requests`, Icon: GroupAddIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN] },
        { key: "sent-requests", label: "Sent", path: `/rooms/${roomId}/settings/invites/sent`, Icon: OutboxIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN] },
      ]
    },
    { key: "admin", label: "Administration", path: `/rooms/${roomId}/settings/admin`, Icon: AdminPanelSettingsIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN] },
  ].filter(link => link.allowed.includes(role));

  const isAiSyncActive = isSettingsModalOpen("ai-sync");

  return (
    <Sidebar className="flex flex-col p-4 pt-20 md:p-5 gap-3 h-auto max-h-[100vh] overflow-y-auto md:h-[calc(100vh-40px)] md:ml-5 md:my-5 w-full md:w-80 shrink-0 backdrop-blur-md bg-card/40 md:bg-card border-none md:border border-border/40 rounded-2xl md:rounded-3xl shadow-xl md:shadow-none hide-scrollbar">
      <nav onClick={handleNavClick} className="flex flex-col gap-3.5 w-full">
        {navLinks.map((item) => (
          item.children ? (
            <div key={item.key} className="flex flex-col gap-1 w-full">
              <NavGroupItem
                item={item}
                isOpen={openSection === item.key}
                isGroupActive={item.children!.some(child => location.pathname === child.path) || isAiSyncActive}
                onToggle={() => toggleSection(item.key)}
              />
            </div>
          ) : (
            <div key={item.key} onClick={() => handleItemClick(item.path!)} className="w-full">
              <NavLinkItem item={item} />
            </div>
          )
        ))}

        <Button
          onClick={() => handleItemClick(`/rooms/${roomId}`)}
          className="flex items-center gap-4 w-full px-5 py-3.5 mt-2 rounded-xl border border-border/40 bg-background-muted/20 text-foreground/80 hover:bg-background-muted/60 hover:text-foreground hover:border-primary/50 cursor-pointer"
        >
          <ArrowBackIcon className="text-primary/70" />
          <span>Back to Room</span>
        </Button>
      </nav>
    </Sidebar>
  );
};