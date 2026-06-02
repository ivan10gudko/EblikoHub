import { useNavigate, NavLink } from "react-router";
import { useAuthStore } from "~/features/auth";
import { Button } from "~/shared/ui/Button";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton, Divider } from "@mui/material";
import { Sidebar } from "~/shared/ui/Sidebar";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
}

export const UserProfileSidebar = ({ isOpen, onClose, userId }: SidebarProps) => {
    const { logout, userId: currentUserId } = useAuthStore();
    const navigate = useNavigate();
    const isOwn = currentUserId === userId;

    const handleLogout = async () => {
        await logout();
        navigate("/auth/login");
        onClose();
    };

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-4 px-5 py-3.5 rounded-xl font-medium transition-all duration-300 border backdrop-blur-sm ${isActive
            ? "bg-primary text-background border-primary shadow-[0_0_14px_rgba(251,146,6,0.35)] font-bold translate-x-1"
            : "text-foreground/80 border-border/40 bg-background-muted/20 hover:bg-background-muted/60 hover:text-foreground hover:border-primary/50 hover:translate-x-1"
        }`;

    const mobileLinkStyle = "flex items-center gap-4 w-full p-4 rounded-2xl bg-background-muted border border-border/50 hover:border-primary/50 hover:scale-[1.02] transition-all duration-200 active:scale-95";
    const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-200 active:scale-95 
    ${isActive
            ? "bg-primary/10 border-primary/70 border"
            : "bg-background-muted border border-border/50 hover:border-primary/50 hover:scale-[1.02]"
        }`;
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
                        onClick={onClose}
                        className={mobileLinkClass}
                    >
                        <PersonOutlineIcon className="text-primary" />
                        <span className="font-semibold text-lg text-foreground">Profile</span>
                    </NavLink>

                    <NavLink to={`/watchlist/${userId}`} onClick={onClose} className={mobileLinkClass}>
                        <FormatListBulletedIcon className="text-primary" />
                        <span className="font-semibold text-lg text-foreground">Watchlist</span>
                    </NavLink>

                    <NavLink to={`/user/${userId}/friends`} onClick={onClose} className={mobileLinkClass}>
                        <PeopleOutlineIcon className="text-primary" />
                        <span className="font-semibold text-lg text-foreground">Friends</span>
                    </NavLink>

                    {isOwn && (
                        <div className="pb-10 mt-4">
                            <button
                                onClick={handleLogout}
                                className={`${mobileLinkStyle} border-danger/40 bg-danger/5 text-danger hover:bg-danger/10 hover:border-danger/60 w-full`}
                            >
                                <LogoutIcon fontSize="small" className="rotate-180" />
                                <span className="font-semibold text-lg">Log Out</span>
                            </button>
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
                        <NavLink to={`/profile/${userId}`} onClick={onClose} className={linkClass}>
                            <PersonOutlineIcon className="scale-110 opacity-90" />
                            <span className="text-lg tracking-wide">Profile</span>
                        </NavLink>

                        <NavLink to={`/watchlist/${userId}`} onClick={onClose} className={linkClass}>
                            <FormatListBulletedIcon className="text-primary scale-110 opacity-90" />
                            <span className="text-lg tracking-wide">Watchlist</span>
                        </NavLink>

                        <NavLink to={`/user/${userId}/friends`} onClick={onClose} className={linkClass}>
                            <PeopleOutlineIcon className="text-primary scale-110 opacity-90" />
                            <span className="text-lg tracking-wide">Friends</span>
                        </NavLink>
                    </nav>

                    {isOwn && (
                        <div className="mt-auto pt-4">
                            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 3 }} />
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-4 py-3.5 px-5 border-danger/40 bg-danger/5 text-danger hover:bg-danger hover:text-white hover:border-danger transition-all duration-300 rounded-xl font-medium shadow-sm"
                                onClick={handleLogout}
                            >
                                <LogoutIcon fontSize="small" className="rotate-180" />
                                <span className="text-base tracking-wide">Log Out</span>
                            </Button>
                        </div>
                    )}
                </div>
            </Sidebar>
        </>
    );
};