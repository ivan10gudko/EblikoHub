import { Outlet, type RouterState } from "react-router";
import Header from "../components/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "~/components/Footer";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from "~/lib/queryClient";
import { supabase } from "~/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import type { Route } from "./+types/MainLayout";


export async function clientLoader() {
    const { data: { session } } = await supabase.auth.getSession();

    return { session };
}

const MainLayout = ({loaderData}: Route.ComponentProps )=> {

    const {session} = loaderData;

    return (
        <QueryClientProvider client={queryClient}>
            <div className="app font-industrial min-h-screen flex flex-col">
                <Header session={session}/>
                <main className="flex-1">
                    <Outlet />
                </main>
                <Footer />
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default MainLayout;