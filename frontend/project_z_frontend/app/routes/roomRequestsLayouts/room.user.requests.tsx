import { useState } from "react";
import { Outlet, redirect, useParams } from "react-router";
import MenuIcon from "@mui/icons-material/Menu";
import { RoomRequestsSidebar } from "~/entities/room";
import { useAuthStore } from "~/features/auth";

export default function RoomsUserRequestsLayout() {
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const {userId} = useAuthStore();

    if(!userId){
        return redirect("/auth/login");
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 min-h-[calc(100vh-64px)]">
            
            <div className="md:hidden w-full">
                <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl bg-background-muted/40 border border-border/40 text-foreground/90 font-medium backdrop-blur-md active:scale-98 transition-all duration-200 shadow-sm"
                >
                    <MenuIcon className="text-primary scale-110" />
                    <span>Rooms requests menu</span>
                </button>
            </div>

            <RoomRequestsSidebar 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                userId = {userId}
            /> 

            <main className="flex-1 w-full">
                <Outlet /> 
            </main>
        </div>
    );
}