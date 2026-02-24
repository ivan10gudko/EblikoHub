import { Outlet, redirect } from "react-router";
import { supabase } from "~/lib/supabase";
import type { Route } from "../+types/root";

export async function clientLoader() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw redirect("/auth");
    }
    return { session };
}

const MainLayout = ({ loaderData }: Route.ComponentProps) => {

    return <Outlet />;

}

export default MainLayout;