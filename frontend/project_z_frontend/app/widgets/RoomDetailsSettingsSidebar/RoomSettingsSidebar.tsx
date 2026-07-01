import SettingsIcon from "@mui/icons-material/Settings";
import ListIcon from "@mui/icons-material/List";
import PeopleIcon from "@mui/icons-material/People";
import MailIcon from "@mui/icons-material/Mail";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Sidebar } from "~/shared/ui/Sidebar";
import { NavLink, useNavigate } from "react-router";
import { Button } from "~/shared/ui/Button";
import { RoomRole } from "~/entities/room/model/room.types";

const getLinkClass = (isActive: boolean) =>
  `flex items-center gap-4 px-5 py-3.5 rounded-xl font-medium transition-all duration-300 border backdrop-blur-sm w-full ${isActive
    ? "bg-primary text-background border-primary shadow-[0_0_14px_rgba(251,146,6,0.35)] font-bold translate-x-1"
    : "text-foreground/80 border-border/40 bg-background-muted/20 hover:bg-background-muted/60 hover:text-foreground hover:border-primary/50 hover:translate-x-1"
  }`;

interface RoomSettingsSidebarProps {
  roomId: number;
  role: RoomRole;
}

export const RoomSettingsSidebar = ({ roomId, role }: RoomSettingsSidebarProps) => {
  const navigate = useNavigate();

  const navLinks = [
    { key: "general", label: "General", path: `/rooms/${roomId}/settings/general`, Icon: SettingsIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN, RoomRole.MEMBER] },
    { key: "titles", label: "Titles", path: `/rooms/${roomId}/settings/titles`, Icon: ListIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN, RoomRole.MEMBER] },
    { key: "members", label: "Members", path: `/rooms/${roomId}/settings/members`, Icon: PeopleIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN, RoomRole.MEMBER] },
    { key: "invites", label: "Invites", path: `/rooms/${roomId}/settings/requests`, Icon: MailIcon, allowed: [RoomRole.OWNER, RoomRole.ADMIN] },
    { key: "admin", label: "Administration", path: `/rooms/${roomId}/settings/admin`, Icon: AdminPanelSettingsIcon, allowed: [RoomRole.OWNER] },
  ].filter(link => link.allowed.includes(role));

  return (
    <Sidebar className="hidden md:flex flex-col p-5 gap-3 h-[calc(100vh-40px)] ml-5 my-5 shrink-0 backdrop-blur-md rounded-3xl md:min-h-[calc(100vh-64px)] w-80">
      <nav className="flex flex-col gap-3.5">
        {navLinks.map(({ key, label, path, Icon }) => (
          <NavLink key={key} to={path} className={({ isActive }) => getLinkClass(isActive)}>
            {({ isActive }) => (
              <span className="flex items-center gap-4 w-full">
                <Icon className={isActive ? "scale-110 opacity-90" : "text-primary scale-110 opacity-90"} />
                <span className="text-lg tracking-wide">{label}</span>
              </span>
            )}
          </NavLink>
        ))}

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