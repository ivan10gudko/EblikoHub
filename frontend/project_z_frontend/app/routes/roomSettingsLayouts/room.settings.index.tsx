import { useState } from "react";
import { Outlet, redirect, useParams, useLocation, Navigate } from "react-router";
import { useRoomDetails } from "~/entities/room";
import { useAuthStore } from "~/features/auth";
import { RoomModalManager, useRoomMemberByRoomIdAndUserId } from "~/features/manageRooms";
import { ErrorScreen } from "~/shared/ui/ErrorScreen";
import { RoomSettingsSidebar } from "~/widgets/RoomDetailsSettingsSidebar";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

export default function RoomsSettingsIndexLayout() {
    const { id: roomId } = useParams<{ id: string }>();
    const location = useLocation(); 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (!roomId) return <ErrorScreen title="Not found" message="Room with that id not found" />;

    const { userId } = useAuthStore();
    if (!userId) return redirect("/auth/login");

    const { data: roomMember, isLoading: isMemberLoading } = useRoomMemberByRoomIdAndUserId(userId, Number(roomId));
    const { room, isLoading: isRoomLoading } = useRoomDetails(Number(roomId));

    if (isMemberLoading || isRoomLoading || !roomMember || !room) {
        return <div className="p-10 text-foreground">Loading settings...</div>;
    }

    
    const isBaseSettingsPath = location.pathname.endsWith(`/rooms/${roomId}/settings`) || 
                               location.pathname.endsWith(`/rooms/${roomId}/settings/`);
    
    if (isBaseSettingsPath) {
        return <Navigate to={`/rooms/${roomId}/settings/general`} replace />;
    }

    return (
        <div className="relative flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 max-w-[1400px] mx-auto min-h-[calc(100vh-64px)] bg-background-muted/30 overflow-x-hidden">
            
           
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            
            <div className={`
                fixed top-0 left-0 h-full z-50 w-[290px] p-4 bg-background border-r border-border
                transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 md:transform-none md:transition-none md:h-auto md:w-80 md:p-0 md:bg-transparent md:border-none md:z-0
            `}>
                <RoomSettingsSidebar
                    roomId={Number(roomId)}
                    role={roomMember.role}
                    onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
                />
            </div>

           
            <main className="flex-1 w-full flex flex-col pt-2 md:pt-5">
                
                
                <div className="md:hidden flex items-center justify-between mb-4 bg-card border border-border p-3 rounded-xl shadow-md">
                    <span className="text-sm font-bold text-foreground">Settings Navigation</span>
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/30 active:scale-95 transition-all text-xs font-semibold cursor-pointer hover:bg-primary/20"
                    >
                        <MenuOpenIcon sx={{ fontSize: 16 }} />
                        <span>Open Menu</span>
                    </button>
                </div>

                <div className="w-full">
                    <Outlet />
                </div>
            </main>
            
            <RoomModalManager roomId={Number(roomId)} />
        </div>
    );
}