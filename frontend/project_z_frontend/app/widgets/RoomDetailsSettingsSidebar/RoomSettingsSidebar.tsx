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

import { Sidebar } from "~/shared/ui/Sidebar";
import { Button } from "~/shared/ui/Button";
import { RoomRole } from "~/entities/room/model/room.types";
import { NavGroupItem, NavLinkItem } from "~/shared/ui/NavLinkItem";
import type { NavItem } from "~/shared/ui/NavLinkItem/NavLinkItem";

interface RoomSettingsSidebarProps {
  roomId: number;
  role: RoomRole;
  onCloseMobileMenu?: () => void;
}

export const RoomSettingsSidebar = ({ roomId, role, onCloseMobileMenu }: RoomSettingsSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSection, setOpenSection] = useState<string | null>(null);

  
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath.includes("/invites")) setOpenSection("invites");
    else if (currentPath.includes("/titles")) setOpenSection("titles");
  }, []);

  
  const handleItemClick = (path: string) => {
    navigate(path);
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  
  const toggleSection = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

 
  const handleNavClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    
    
    const isDropdownHeader = target.closest('[class*="NavGroupItem"]') && !target.closest('ul') && !target.closest('li');
    
   
    if (onCloseMobileMenu && !isDropdownHeader && (target.closest('a') || target.closest('li') || target.closest('[role="button"]'))) {
      
      setTimeout(() => {
        onCloseMobileMenu();
      }, 50);
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
    <Sidebar className="flex flex-col p-4 pt-20 md:p-5 gap-3 h-auto max-h-[100vh] overflow-y-auto md:h-[calc(100vh-40px)] md:ml-5 md:my-5 w-full md:w-80 shrink-0 backdrop-blur-md bg-card/40 md:bg-card border-none md:border border-border/40 rounded-2xl md:rounded-3xl shadow-xl md:shadow-none hide-scrollbar">
      
      <nav onClick={handleNavClick} className="flex flex-col gap-3.5 w-full">
        {navLinks.map((item) => (
          item.children ? (
            <NavGroupItem
              key={item.key}
              item={item}
              isOpen={openSection === item.key}
              isGroupActive={item.children!.some(child => location.pathname === child.path)}
              onToggle={() => toggleSection(item.key)} 
            />
          ) : (
            <div key={item.key} onClick={() => handleItemClick(item.path!)} className="w-full">
              <NavLinkItem item={item} />
            </div>
          )
        ))}

        <Button 
          onClick={() => {
            navigate(`/rooms/${roomId}`);
            if (onCloseMobileMenu) onCloseMobileMenu();
          }} 
          className="flex items-center gap-4 w-full px-5 py-3.5 mt-2 rounded-xl border border-border/40 bg-background-muted/20 text-foreground/80 hover:bg-background-muted/60 hover:text-foreground hover:border-primary/50 cursor-pointer"
        >
          <ArrowBackIcon className="text-primary/70" />
          <span>Back to Room</span>
        </Button>
      </nav>
    </Sidebar>
  );
};