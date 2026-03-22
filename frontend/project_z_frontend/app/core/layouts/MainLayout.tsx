import { Outlet } from "react-router";
import Header from "../../widgets/Header/Header";
import Footer from "../../widgets/Footer/Footer";
import type { Session } from "@supabase/supabase-js";



const MainLayout = () => {
    return (
        <div className="app font-industrial min-h-screen flex flex-col">
            <Header/>
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;