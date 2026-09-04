import { useState } from "react";
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

const getNavLinks = (roomId: number, role: RoomRole): NavItem[] =>
  [
    {
      key: "general",
      label: "General",
      path: `/rooms/${roomId}/settings/general`,
      Icon: SettingsIcon,
      allowed: [RoomRole.OWNER, RoomRole.ADMIN, RoomRole.MEMBER],
    },
    {
      key: "titles",
      label: "Titles",
      Icon: ListIcon,
      allowed: [RoomRole.OWNER, RoomRole.ADMIN, RoomRole.MEMBER],
      children: [
        {
          key: "room-titles",
          label: "Room Titles",
          path: `/rooms/${roomId}/settings/titles`,
          Icon: EmojiEventsIcon,
          end: true,
        },
        {
          key: "title-links",
          label: "Title Links",
          path: `/rooms/${roomId}/settings/titles/titleLinks`,
          Icon: LinkIcon,
        },
        {
          key: "ai-matcher",
          label: "AI Title Matcher",
          path: `/rooms/${roomId}/settings/titles/ai-matcher`,
          Icon: AutoAwesomeIcon,
        },
      ],
    },
    {
      key: "members",
      label: "Members",
      path: `/rooms/${roomId}/settings/members`,
      Icon: PeopleIcon,
      allowed: [RoomRole.OWNER, RoomRole.ADMIN, RoomRole.MEMBER],
    },
    {
      key: "invites",
      label: "Invites",
      Icon: MailIcon,
      allowed: [RoomRole.OWNER, RoomRole.ADMIN],
      children: [
        {
          key: "find-user",
          label: "Find User",
          path: `/rooms/${roomId}/settings/invites`,
          Icon: PersonSearchIcon,
          end: true,
        },
        {
          key: "join-requests",
          label: "Join Requests",
          path: `/rooms/${roomId}/settings/invites/requests`,
          Icon: GroupAddIcon,
        },
        {
          key: "sent-requests",
          label: "Sent",
          path: `/rooms/${roomId}/settings/invites/sent`,
          Icon: OutboxIcon,
        },
      ],
    },
    {
      key: "admin",
      label: "Administration",
      path: `/rooms/${roomId}/settings/admin`,
      Icon: AdminPanelSettingsIcon,
      allowed: [RoomRole.OWNER, RoomRole.ADMIN],
    },
  ].filter((link) => link.allowed.includes(role));

interface RoomSettingsSidebarProps {
  roomId: number;
  role: RoomRole;
  onCloseMobileMenu?: () => void;
}

export const RoomSettingsSidebar = ({
  roomId,
  role,
  onCloseMobileMenu,
}: RoomSettingsSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [openSection, setOpenSection] = useState<string | null>(() => {
    if (location.pathname.includes("/invites")) return "invites";
    if (location.pathname.includes("/titles")) return "titles";
    if (location.pathname.includes("/ai-matcher")) return "titles";
    return null;
  });

  const handleItemClick = (path: string) => {
    navigate(path);
    onCloseMobileMenu?.();
  };

  const toggleSection = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  const navLinks = getNavLinks(roomId, role);

  return (
    <Sidebar className="flex flex-col p-4 pt-20 md:p-5 gap-3 h-auto max-h-[100vh] overflow-y-auto md:h-[calc(100vh-40px)] md:ml-5 md:my-5 w-full md:w-80 shrink-0 backdrop-blur-md bg-card/40 md:bg-card border-none md:border border-border/40 rounded-2xl md:rounded-3xl shadow-xl md:shadow-none hide-scrollbar">
      <nav className="flex flex-col gap-3.5 w-full">
        {navLinks.map((item) =>
          "children" in item && item.children ? (
            <NavGroupItem
              key={item.key}
              item={item}
              isOpen={openSection === item.key}
              isGroupActive={item.children.some(
                (child) => location.pathname === child.path
              )}
              onToggle={() => toggleSection(item.key)}
              onChildClick={onCloseMobileMenu}
            />
          ) : (
            <NavLinkItem
              key={item.key}
              item={item}
              onClick={() => handleItemClick(item.path)}
            />
          )
        )}

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