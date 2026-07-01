import GroupIcon from "@mui/icons-material/Group";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import OutboxIcon from "@mui/icons-material/Outbox";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { Sidebar } from "~/shared/ui/Sidebar";
import { NavLink, useNavigate } from "react-router";
import { Button } from "~/shared/ui/Button";
import { useRoomRequestCounts } from "../hooks/useRoomRequestCounts";



const getLinkClass = (isActive: boolean) =>
  `flex items-center gap-4 px-5 py-3.5 rounded-xl font-medium transition-all duration-300 border backdrop-blur-sm w-full ${isActive
    ? "bg-primary text-background border-primary shadow-[0_0_14px_rgba(251,146,6,0.35)] font-bold translate-x-1"
    : "text-foreground/80 border-border/40 bg-background-muted/20 hover:bg-background-muted/60 hover:text-foreground hover:border-primary/50 hover:translate-x-1"
  }`;

interface RoomSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const RoomRequestsSidebar = ({ isOpen, onClose, userId }: RoomSidebarProps) => {
  const navigate = useNavigate();
  const RequestBadge = ({ count }: { count: number }) => {
    if (!count || count === 0) return null;
    return (
      <span className="ml-auto bg-primary text-background text-xs font-bold px-2 py-0.5 rounded-full">
        {count}
      </span>
    );
  };
  const { data: counts } = useRoomRequestCounts(userId);

  const navLinks = [
    { key: "find-room", label: "Find room", getPath: () => "", Icon: GroupIcon, end: true },
    {
      key: "invites",
      label: "Invites",
      getPath: () => `/rooms/requests/invites`,
      Icon: MarkEmailUnreadIcon,
      end: false,
      count: counts?.incomingCount || 0
    },
    {
      key: "join-requests",
      label: "Sent Requests",
      getPath: () => `/rooms/requests/sent`,
      Icon: OutboxIcon,
      end: true,
      count: counts?.outgoingCount || 0
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-card/60 backdrop-blur-xl z-100 transition-all duration-300 md:hidden p-6 pt-[70px] md:mt-0 mt-[70px] ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      >
        <Button variant="text-only" className="absolute top-4 right-4" onClick={onClose}>
          <CloseIcon className="text-primary/70" />
        </Button>
        <nav className="w-full max-w-sm flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
          {navLinks.map(({ key, label, getPath, Icon, end, count }) => (
            <NavLink key={key} to={getPath()} onClick={onClose} className={({ isActive }) => getLinkClass(isActive)} end={end}>
              {({ isActive }) => (
                <span className="flex items-center gap-4 w-full">
                  <Icon className={isActive ? "scale-110 opacity-90" : "text-primary scale-110 opacity-90"} />
                  <span className="text-lg tracking-wide">{label}</span>
                  <RequestBadge count={count ?? 0} />
                </span>
              )}
            </NavLink>
          ))}
          <Button
            onClick={() => navigate("/rooms/user/" + userId)}
            className="flex items-center gap-4 w-full px-5 py-3.5 mt-2 rounded-xl border border-border/40 bg-background-muted/20 text-foreground/80 hover:bg-background-muted/60"
          >
            <ArrowBackIcon className="text-primary/70" />
            <span>Back to Room List</span>
          </Button>
        </nav>
      </div>

      <Sidebar className="hidden md:flex flex-col p-5 gap-3 h-fit shrink-0 backdrop-blur-md rounded-3xl md:min-h-[calc(100vh-64px)] w-80">
        <nav className="flex flex-col gap-3.5">
          {navLinks.map(({ key, label, getPath, Icon, end, count }) => (
            <NavLink key={key} to={getPath()} onClick={onClose} className={({ isActive }) => getLinkClass(isActive)} end={end}>
              {({ isActive }) => (
                <span className="flex items-center gap-4 w-full">
                  <Icon className={isActive ? "scale-110 opacity-90" : "text-primary scale-110 opacity-90"} />
                  <span className="text-lg tracking-wide">{label}</span>
                  <RequestBadge count={count ?? 0} />
                </span>
              )}
            </NavLink>
          ))}
          <Button
            onClick={() => navigate("/rooms/user/" + userId)}
            className="flex items-center gap-4 w-full px-5 py-3.5 mt-2 rounded-xl border border-border/40 bg-background-muted/20 text-foreground/80 hover:bg-background-muted/60"
          >
            <ArrowBackIcon className="text-primary/70" />
            <span>Back to Room List</span>
          </Button>
        </nav>
      </Sidebar>
    </>
  );
};