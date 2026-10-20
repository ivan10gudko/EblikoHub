import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

export const NotificationBadge = () => {
    return (
        <div
            className="relative flex items-center justify-center p-1 text-red-400/90 transition-all"
            title="Pending friend requests"
        >
            < span className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse duration-1000" />

            < NotificationsActiveIcon sx={{ fontSize: 18 }
            } className="relative z-10 opacity-90" />
        </div>
    );
};