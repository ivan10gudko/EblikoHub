import { useAuthStore } from "~/features/auth";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import { Divider } from "@mui/material";
import { Sidebar } from "~/shared/ui/Sidebar";
import LogoutButton from "~/features/auth/ui/LogoutButton";
import { NavLink } from "react-router";

const getLinkClass = (isActive: boolean) =>
  `flex items-center gap-4 px-5 py-3.5 rounded-xl font-medium transition-all duration-300 border backdrop-blur-sm ${
    isActive
      ? "bg-primary text-background [&>svg]:text-background border-primary shadow-[0_0_14px_rgba(251,146,6,0.35)] font-bold translate-x-1"
      : "text-foreground/80 border-border/40 bg-background-muted/20 hover:bg-background-muted/60 hover:text-foreground hover:border-primary/50 hover:translate-x-1"
  }`;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const UserProfileSidebar = ({
  isOpen,
  onClose,
  userId,
}: SidebarProps) => {
  const { userId: currentUserId } = useAuthStore();

  const isOwn = currentUserId === userId;

  const mobileLinkStyle =
    "flex items-center gap-4 w-full p-4 rounded-2xl bg-background-muted border border-border/50 hover:border-primary/50 hover:scale-[1.02] transition-all duration-200 active:scale-95";

  return (
    <>
      <div
        className={`fixed inset-0 bg-card/60 backdrop-blur-xl z-[999] transition-all duration-300 flex justify-center p-6 pt-[93px]  md:min-h-[calc(100vh-64px)] md:mt-0 mt-[93px]
                    md:hidden
                    ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-4"}
                `}
        onClick={onClose}
      >
        <nav
          className="w-full max-w-sm flex flex-col gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <NavLink
            to={`/profile/${userId}`}
            end
            onClick={onClose}
            className={({ isActive }) => getLinkClass(isActive)}
          >
            <PersonOutlineIcon className="text-primary" />
            <span className="font-semibold text-lg text-foreground">
              Profile
            </span>
          </NavLink>

          <NavLink
            to={`/watchlist/${userId}`}
            onClick={onClose}
            className={({ isActive }) => getLinkClass(isActive)}
          >
            <FormatListBulletedIcon className="text-primary" />
            <span className="font-semibold text-lg text-foreground">
              Watchlist
            </span>
          </NavLink>

          <NavLink
            to={`${userId}/friends`}
            onClick={onClose}
            className={({ isActive }) => getLinkClass(isActive)}
          >
            <PeopleOutlineIcon className="text-primary" />
            <span className="font-semibold text-lg text-foreground">
              Friends
            </span>
          </NavLink>

          {isOwn && (
            <NavLink
              to={`${userId}/settings`}
              onClick={onClose}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              <SettingsIcon className="text-primary" />
              <span className="font-semibold text-lg text-foreground">
                Settings
              </span>
            </NavLink>
          )}

          {isOwn && (
            <div className="pb-10 mt-4">
              <LogoutButton clickFallback={onClose} />
            </div>
          )}
        </nav>
      </div>

      <Sidebar
        className="hidden md:flex flex-col fixed inset-y-0 left-0 z-50 w-72 bg-background/95 border-r border-border/60
                    shadow-2xl backdrop-blur-md rounded-none
                    md:relative md:min-h-[calc(100vh-64px)] md:z-auto md:rounded-3xl md:shadow-none"
      >
        <div className="flex flex-col h-full p-5 gap-2">
          <nav className="flex flex-col gap-3.5">
            <NavLink
              to={`/profile/${userId}`}
              end
              onClick={onClose}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              <PersonOutlineIcon className="scale-110 opacity-90 text-primary" />
              <span className="text-lg tracking-wide">Profile</span>
            </NavLink>

            <NavLink
              to={`/watchlist/${userId}`}
              onClick={onClose}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              <FormatListBulletedIcon className="text-primary scale-110 opacity-90" />
              <span className="text-lg tracking-wide">Watchlist</span>
            </NavLink>

            <NavLink
              to={`${userId}/friends`}
              onClick={onClose}
              className={({ isActive }) => getLinkClass(isActive)}
            >
              <PeopleOutlineIcon className="text-primary scale-110 opacity-90" />
              <span className="text-lg tracking-wide">Friends</span>
            </NavLink>

            {isOwn && (
              <NavLink
                to={`${userId}/settings`}
                onClick={onClose}
                className={({ isActive }) => getLinkClass(isActive)}
              >
                <SettingsIcon className="text-primary" />
                <span className="text-lg tracking-wide">Settings</span>
              </NavLink>
            )}
          </nav>

          {isOwn && (
            <div className="mt-auto pt-4">
              <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 3 }} />
              <LogoutButton clickFallback={onClose} />
            </div>
          )}
        </div>
      </Sidebar>
    </>
  );
};
