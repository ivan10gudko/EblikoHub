import PeopleIcon from "@mui/icons-material/People";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import OutboxIcon from "@mui/icons-material/Outbox";
import { Sidebar } from "~/shared/ui/Sidebar";
import { NavLink, useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const getLinkClass = (isActive: boolean) =>
    `flex items-center gap-4 px-5 py-3.5 rounded-xl font-medium transition-all duration-300 border backdrop-blur-sm w-full ${isActive
        ? "bg-primary text-background border-primary shadow-[0_0_14px_rgba(251,146,6,0.35)] font-bold translate-x-1"
        : "text-foreground/80 border-border/40 bg-background-muted/20 hover:bg-background-muted/60 hover:text-foreground hover:border-primary/50 hover:translate-x-1"
    }`;

interface FriendsSidebarProps {
    friendsCount: number;
    pendingCount?: number;
    sentCount?: number;
    isReadOnly?: boolean;
    userId: string;
    isOpen: boolean;   // Додано для контролю шторки
    onClose: () => void; // Додано для закриття меню
}

export const FriendsSidebar = ({ 
    userId, 
    friendsCount, 
    pendingCount = 0, 
    sentCount = 0, 
    isReadOnly = false,
    isOpen,
    onClose
}: FriendsSidebarProps) => {
    const navigate = useNavigate();

    return (
        <>
            <div
                className={`fixed inset-0 bg-card/60 backdrop-blur-xl z-[999] transition-all duration-300 flex justify-center p-6 pt-[93px] md:min-h-[calc(100vh-64px)] md:mt-0 mt-[93px]
                    md:hidden
                    ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-4"}
                `}
                onClick={onClose}
            >
                <nav
                    className=" w-full max-w-sm flex flex-col gap-3"
                    onClick={(e) => e.stopPropagation()}
                    translate="no"
                >
                    <NavLink to={`/user/${userId}/friends`} end onClick={onClose} className={({ isActive }) => getLinkClass(isActive)}>
                        {({ isActive }) => (
                            <span className="flex items-center gap-4 w-full">
                                <PeopleIcon className={isActive ? "scale-110 opacity-90" : "text-primary scale-110 opacity-90"} />
                                <span className="text-lg tracking-wide">Your Friends</span>
                                <span className={`ml-auto text-xs font-black w-6 h-6 flex items-center justify-center rounded-full ${isActive ? "bg-background/20 text-background" : "bg-background-muted text-foreground border-border/40"}`}>
                                    {friendsCount}
                                </span>
                            </span>
                        )}
                    </NavLink>

                    {!isReadOnly && (
                        <>
                            <NavLink to={`/user/${userId}/friends/add`} onClick={onClose} className={({ isActive }) => getLinkClass(isActive)}>
                                {({ isActive }) => (
                                    <span className="flex items-center gap-4 w-full">
                                        <PersonAddAlt1Icon className={isActive ? "scale-110 opacity-90" : "text-primary scale-110 opacity-90"} />
                                        <span className="text-lg tracking-wide">Add a Friend</span>
                                    </span>
                                )}
                            </NavLink>

                            <NavLink to={`/user/${userId}/friends/pending`} onClick={onClose} className={({ isActive }) => getLinkClass(isActive)}>
                                {({ isActive }) => (
                                    <span className="flex items-center gap-4 w-full">
                                        <MarkEmailUnreadIcon className={isActive ? "scale-110 opacity-90" : "text-primary scale-110 opacity-90"} />
                                        <span className="text-lg tracking-wide">Pending Invites</span>
                                        <span className={`ml-auto text-xs font-black w-6 h-6 flex items-center justify-center rounded-full ${isActive ? "bg-background/20 text-background" : "bg-background-muted text-foreground border-border/60"}`}>
                                            {pendingCount}
                                        </span>
                                    </span>
                                )}
                            </NavLink>

                            <NavLink to={`/user/${userId}/friends/sent`} onClick={onClose} className={({ isActive }) => getLinkClass(isActive)}>
                                {({ isActive }) => (
                                    <span className="flex items-center gap-4 w-full">
                                        <OutboxIcon className={isActive ? "scale-110 opacity-90" : "text-primary scale-110 opacity-90"} />
                                        <span className="text-lg tracking-wide">Sent Requests</span>
                                        <span className={`ml-auto text-xs font-black w-6 h-6 flex items-center justify-center rounded-full ${isActive ? "bg-background/20 text-background" : "bg-background-muted text-foreground border-border/40"}`}>
                                            {sentCount}
                                        </span>
                                    </span>
                                )}
                            </NavLink>
                        </>
                    )}

                    <button
                        type="button"
                        onClick={() => { navigate(`/profile/${userId}`); onClose(); }}
                        className="flex items-center gap-4 w-full px-5 py-3.5 mt-2 rounded-xl font-medium border border-border/40 bg-background-muted/20 text-foreground/80 hover:bg-background-muted/60 hover:text-foreground hover:border-primary/50 hover:translate-x-1 transition-all duration-300"
                    >
                        <ArrowBackIcon className="text-primary/70 scale-110 opacity-90" />
                        <span className="text-base tracking-wide">
                            {isReadOnly ? "Back to Profile" : "My Profile"}
                        </span>
                    </button>
                </nav>
            </div>

            {/* ДЕСКТОПНА ВЕРСІЯ (СТАТИЧНИЙ САЙДБАР) */}
            <Sidebar 
                className=" hidden md:flex flex-col p-5 gap-3 h-fit shrink-0 backdrop-blur-md rounded-3xl md:min-h-[calc(100vh-64px)] w-80"
            >
                <nav className="flex flex-col gap-3.5" translate="no">
                    <NavLink to={`/user/${userId}/friends`} end className={({ isActive }) => getLinkClass(isActive)}>
                        {({ isActive }) => (
                            <span className="flex items-center gap-4 w-full">
                                <PeopleIcon className={isActive ? "scale-110 opacity-90" : "text-primary scale-110 opacity-90"} />
                                <span className="text-lg tracking-wide">Your Friends</span>
                                <span className={`ml-auto text-xs font-black w-6 h-6 flex items-center justify-center rounded-full ${isActive ? "bg-background/20 text-background" : "bg-background-muted text-foreground border-border/40"}`}>
                                    {friendsCount}
                                </span>
                            </span>
                        )}
                    </NavLink>

                    {!isReadOnly && (
                        <>
                            <NavLink to={`/user/${userId}/friends/add`} className={({ isActive }) => getLinkClass(isActive)}>
                                {({ isActive }) => (
                                    <span className="flex items-center gap-4 w-full">
                                        <PersonAddAlt1Icon className={isActive ? "scale-110 opacity-90" : "text-primary scale-110 opacity-90"} />
                                        <span className="text-lg tracking-wide">Add a Friend</span>
                                    </span>
                                )}
                            </NavLink>

                            <NavLink to={`/user/${userId}/friends/pending`} className={({ isActive }) => getLinkClass(isActive)}>
                                {({ isActive }) => (
                                    <span className="flex items-center gap-4 w-full">
                                        <MarkEmailUnreadIcon className={isActive ? "scale-110 opacity-90" : "text-primary scale-110 opacity-90"} />
                                        <span className="text-lg tracking-wide">Pending Invites</span>
                                        <span className={`ml-auto text-xs font-black w-6 h-6 flex items-center justify-center rounded-full ${isActive ? "bg-background/20 text-background" : "bg-background-muted text-foreground border-border/60"}`}>
                                            {pendingCount}
                                        </span>
                                    </span>
                                )}
                            </NavLink>

                            <NavLink to={`/user/${userId}/friends/sent`} className={({ isActive }) => getLinkClass(isActive)}>
                                {({ isActive }) => (
                                    <span className="flex items-center gap-4 w-full">
                                        <OutboxIcon className={isActive ? "scale-110 opacity-90" : "text-primary scale-110 opacity-90"} />
                                        <span className="text-lg tracking-wide">Sent Requests</span>
                                        <span className={`ml-auto text-xs font-black w-6 h-6 flex items-center justify-center rounded-full ${isActive ? "bg-background/20 text-background" : "bg-background-muted text-foreground border-border/40"}`}>
                                            {sentCount}
                                        </span>
                                    </span>
                                )}
                            </NavLink>
                        </>
                    )}

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