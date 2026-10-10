import PeopleIcon from "@mui/icons-material/People";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import OutboxIcon from "@mui/icons-material/Outbox";
import { Sidebar } from "~/shared/ui/Sidebar";
import { NavLink, useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "~/shared/ui/Button";

type CountKey = "friendsCount" | "pendingCount" | "sentCount";

const NAV_LINKS = [
  {
    key: "friends",
    label: "Your Friends",
    getPath: (id: string) => `/profile/${id}/friends`,
    end: true,
    isPrivate: false,
    Icon: PeopleIcon,
    countKey: "friendsCount" as CountKey,
  },
  {
    key: "add",
    label: "Add a Friend",
    getPath: () => `add`,
    end: false,
    isPrivate: true,
    Icon: PersonAddAlt1Icon,
  },
  {
    key: "pending",
    label: "Pending Invites",
    getPath: () => `pending`,
    end: false,
    isPrivate: true,
    Icon: MarkEmailUnreadIcon,
    countKey: "pendingCount" as CountKey,
  },
  {
    key: "sent",
    label: "Sent Requests",
    getPath: () => `sent`,
    end: false,
    isPrivate: true,
    Icon: OutboxIcon,
    countKey: "sentCount" as CountKey,
  },
];

const getLinkClass = (isActive: boolean) =>
  `flex items-center gap-4 px-5 py-3.5 rounded-xl font-medium transition-all duration-300 border backdrop-blur-sm w-full ${
    isActive
      ? "bg-primary text-background border-primary shadow-[0_0_14px_rgba(251,146,6,0.35)] font-bold translate-x-1"
      : "text-foreground/80 border-border/40 bg-background-muted/20 hover:bg-background-muted/60 hover:text-foreground hover:border-primary/50 hover:translate-x-1"
  }`;

interface FriendsSidebarProps {
  friendsCount: number;
  pendingCount?: number;
  sentCount?: number;
  isReadOnly?: boolean;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const FriendsSidebar = ({
  userId,
  friendsCount,
  pendingCount = 0,
  sentCount = 0,
  isReadOnly = false,
  isOpen,
  onClose,
}: FriendsSidebarProps) => {
  const navigate = useNavigate();

  const counts: Record<CountKey, number> = {
    friendsCount,
    pendingCount,
    sentCount,
  };

  const visibleLinks = NAV_LINKS.filter(
    (link) => !link.isPrivate || !isReadOnly,
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-card/60 backdrop-blur-xl z-100 transition-all duration-300 flex justify-center p-6 pt-[70px] md:min-h-[calc(100vh-64px)] md:mt-0 mt-[70px] md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none translate-y-4"
        }`}
        onClick={onClose}
      >
        <Button
          variant="text-only"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <CloseIcon className="text-primary/70 scale-110 opacity-90" />
        </Button>
        <nav
          className="w-full max-w-sm flex flex-col gap-3"
          onClick={(e) => e.stopPropagation()}
          translate="no"
        >
          {visibleLinks.map(({ key, label, getPath, end, Icon, countKey }) => (
            <NavLink
              key={key}
              to={getPath(userId)}
              end={end}
              onClick={onClose}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              {({ isActive }) => (
                <span className="flex items-center gap-4 w-full">
                  <Icon
                    className={
                      isActive
                        ? "scale-110 opacity-90"
                        : "text-primary scale-110 opacity-90"
                    }
                  />
                  <span className="text-lg tracking-wide">{label}</span>
                  {countKey && (
                    <span
                      className={`ml-auto text-xs font-black w-6 h-6 flex items-center justify-center rounded-full ${
                        isActive
                          ? "bg-background/20 text-background"
                          : "bg-background-muted text-foreground border-border/40"
                      }`}
                    >
                      {counts[countKey]}
                    </span>
                  )}
                </span>
              )}
            </NavLink>
          ))}

          <button
            type="button"
            onClick={() => {
              navigate(`/profile/${userId}`);
              onClose();
            }}
            className="flex items-center gap-4 w-full px-5 py-3.5 mt-2 rounded-xl font-medium border border-border/40 bg-background-muted/20 text-foreground/80 hover:bg-background-muted/60 hover:text-foreground hover:border-primary/50 hover:translate-x-1 transition-all duration-300"
          >
            <ArrowBackIcon className="text-primary/70 scale-110 opacity-90" />
            <span className="text-base tracking-wide">
              {isReadOnly ? "Back to Profile" : "My Profile"}
            </span>
          </button>
        </nav>
      </div>

      <Sidebar className="hidden md:flex flex-col p-5 gap-3 h-fit shrink-0 backdrop-blur-md rounded-3xl md:min-h-[calc(100vh-64px)] w-80">
        <nav className="flex flex-col gap-3.5" translate="no">
          {visibleLinks.map(({ key, label, getPath, end, Icon, countKey }) => (
            <NavLink
              key={key}
              to={getPath(userId)}
              end={end}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              {({ isActive }) => (
                <span className="flex items-center gap-4 w-full">
                  <Icon
                    className={
                      isActive
                        ? "scale-110 opacity-90"
                        : "text-primary scale-110 opacity-90"
                    }
                  />
                  <span className="text-lg tracking-wide">{label}</span>
                  {countKey && (
                    <span
                      className={`ml-auto text-xs font-black w-6 h-6 flex items-center justify-center rounded-full ${
                        isActive
                          ? "bg-background/20 text-background"
                          : "bg-background-muted text-foreground border-border/40"
                      }`}
                    >
                      {counts[countKey]}
                    </span>
                  )}
                </span>
              )}
            </NavLink>
          ))}

          <button
            type="button"
            onClick={() => navigate(`/profile/${userId}`)}
            className="flex items-center gap-4 w-full px-5 py-3.5 mt-2 rounded-xl font-medium border border-border/40 bg-background-muted/20 text-foreground/80 hover:bg-background-muted/60 hover:text-foreground hover:border-primary/50 hover:translate-x-1 transition-all duration-300"
          >
            <ArrowBackIcon className="text-primary/70 scale-110 opacity-90" />
            <span className="text-base tracking-wide">
              {isReadOnly ? "Back to Profile" : "My Profile"}
            </span>
          </button>
        </nav>
      </Sidebar>
    </>
  );
};
