import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import type { Session } from "@supabase/supabase-js";

interface MainLayoutProps {
    session: Session | null;
}

const MainLayout = ({ session }: MainLayoutProps) => {
    return (
        <div className="app font-industrial min-h-screen flex flex-col">
            <Header session={session} />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;