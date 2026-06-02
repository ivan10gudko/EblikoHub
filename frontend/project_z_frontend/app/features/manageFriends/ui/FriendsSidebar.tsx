import PeopleIcon from "@mui/icons-material/People";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import OutboxIcon from "@mui/icons-material/Outbox";
import { Sidebar } from "~/shared/ui/Sidebar";
import type { TabType } from "../types/friends.types";
import { useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


interface FriendsSidebarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    friendsCount: number;
    pendingCount?: number;
    sentCount?: number;
    isReadOnly?: boolean;
    userId: string;
}
export const FriendsSidebar = ({
    activeTab,
    onTabChange,
    friendsCount,
    pendingCount = 0,
    sentCount = 0,
    isReadOnly = false,
    userId
}: FriendsSidebarProps) => {
    const navigate = useNavigate();

    const desktopTabClass = (tab: TabType) =>
        `flex items-center gap-4 px-5 py-3.5 rounded-xl font-medium transition-all duration-300 border backdrop-blur-sm w-full
        ${isReadOnly ? "cursor-default" : "cursor-pointer"}
        ${activeTab === tab
            ? "bg-primary text-background border-primary shadow-[0_0_14px_rgba(251,146,6,0.35)] font-bold translate-x-1"
            : "text-foreground/80 border-border/40 bg-background-muted/20 hover:bg-background-muted/60 hover:text-foreground hover:border-primary/50 hover:translate-x-1"
        }`;

    const desktopIconClass = (tab: TabType) =>
        `scale-110 opacity-90 transition-colors duration-300 ${activeTab === tab ? "" : "text-primary"}`;

    const desktopBadgeClass = (tab: TabType, isPendingTab = false) =>
        `ml-auto text-xs font-black w-6 h-6 flex items-center justify-center rounded-full
        ${activeTab === tab
            ? "bg-background/20 text-background"
            : isPendingTab && pendingCount > 0
                ? "bg-background-muted text-foreground border-border/60"
                : "bg-background-muted text-foreground border-border/40"
        }`;


    const mobileBaseStyle = "flex items-center gap-4 w-full p-4 rounded-2xl bg-background-muted hover:border-primary/50 hover:scale-[1.02] transition-all duration-200 active:scale-95";

    const mobileTabClass = (tab: TabType) =>
        `${mobileBaseStyle} ${activeTab === tab ? "border-primary/70 bg-primary/10" : ""} ${isReadOnly ? "cursor-default" : "cursor-pointer"}`;

    return (
        <Sidebar className="w-full md:w-72 flex flex-col p-5 gap-3 h-fit shrink-0 backdrop-blur-md rounded-none md:rounded-3xl md:min-h-[calc(100vh-64px)] md:mt-0 mt-[93px]">


            <nav className="hidden md:flex flex-col gap-3.5">
                <button
                    onClick={() => !isReadOnly && onTabChange("friends")}
                    className={desktopTabClass("friends")}
                    disabled={isReadOnly}
                >
                    <PeopleIcon className={desktopIconClass("friends")} />
                    <span className="text-lg tracking-wide">
                        {isReadOnly ? "Friends" : "Your Friends"}
                    </span>
                    <span className={desktopBadgeClass("friends")}>{friendsCount}</span>
                </button>

                {!isReadOnly && (
                    <>
                        <button onClick={() => onTabChange("add")} className={desktopTabClass("add")}>
                            <PersonAddAlt1Icon className={desktopIconClass("add")} />
                            <span className="text-lg tracking-wide">Add a Friend</span>
                        </button>

                        <button onClick={() => onTabChange("pending")} className={desktopTabClass("pending")}>
                            <MarkEmailUnreadIcon className={desktopIconClass("pending")} />
                            <span className="text-lg tracking-wide">Pending Invites</span>
                            <span className={desktopBadgeClass("pending", true)}>{pendingCount}</span>
                        </button>

                        <button onClick={() => onTabChange("sent")} className={desktopTabClass("sent")}>
                            <OutboxIcon className={desktopIconClass("sent")} />
                            <span className="text-lg tracking-wide">Sent Requests</span>
                            <span className={desktopBadgeClass("sent")}>{sentCount}</span>
                        </button>
                    </>
                )}


                <button
                    onClick={() => navigate(`/profile/${userId}`)}
                    className="flex items-center gap-4 w-full px-5 py-3.5 rounded-xl font-medium border border-border/40 bg-background-muted/20 text-foreground/80 hover:bg-background-muted/60 hover:text-foreground hover:border-primary/50 hover:translate-x-1 transition-all duration-300"
                >
                    <ArrowBackIcon className="text-primary scale-110 opacity-90" />
                    <span className="text-base tracking-wide">
                        {isReadOnly ? "Back to Profile" : "My Profile"}
                    </span>
                </button>
            </nav>

            <nav className="flex md:hidden flex-col gap-3">
                <button
                    onClick={() => !isReadOnly && onTabChange("friends")}
                    className={mobileTabClass("friends")}
                    disabled={isReadOnly}
                >
                    <PeopleIcon className="text-primary" />
                    <span className="font-semibold text-lg text-foreground">
                        {isReadOnly ? "Friends" : "Your Friends"}
                    </span>
                    <span className="ml-auto text-xs font-black w-6 h-6 flex items-center justify-center rounded-full border bg-background-muted text-foreground border-border/40">
                        {friendsCount}
                    </span>
                </button>

                {!isReadOnly && (
                    <>
                        <button onClick={() => onTabChange("add")} className={mobileTabClass("add")}>
                            <PersonAddAlt1Icon className="text-primary" />
                            <span className="font-semibold text-lg text-foreground">Add a Friend</span>
                        </button>

                        <button onClick={() => onTabChange("pending")} className={mobileTabClass("pending")}>
                            <MarkEmailUnreadIcon className="text-primary" />
                            <span className="font-semibold text-lg text-foreground">Pending Invites</span>
                            <span className="ml-auto text-xs font-black w-6 h-6 flex items-center justify-center rounded-full border bg-background-muted text-foreground border-border/40">
                                {pendingCount}
                            </span>
                        </button>

                        <button onClick={() => onTabChange("sent")} className={mobileTabClass("sent")}>
                            <OutboxIcon className="text-primary" />
                            <span className="font-semibold text-lg text-foreground">Sent Requests</span>
                            <span className="ml-auto text-xs font-black w-6 h-6 flex items-center justify-center rounded-full border bg-background-muted text-foreground border-border/40">
                                {sentCount}
                            </span>
                        </button>
                    </>
                )}

                <button
                    onClick={() => navigate(`/profile/${userId}`)}
                    className={`${mobileBaseStyle} mt-2 border-border/40 text-foreground/80`}
                >
                    <ArrowBackIcon className="text-primary/70" />
                    <span className="font-semibold text-lg text-foreground">
                        {isReadOnly ? "Back to Profile" : "My Profile"}
                    </span>
                </button>
            </nav>
        </Sidebar>
    );
};