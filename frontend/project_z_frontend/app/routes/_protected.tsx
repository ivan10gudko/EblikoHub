import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/_protected";
import { supabase } from "~/shared/lib";
import { Loader } from "~/shared/ui/Loader";

export async function clientLoader() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        throw redirect("/auth/login");
    }

    return { session };
}

export function HydrateFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader />
        </div>
    );
}

export default function ProtectedRoute({ loaderData }: Route.ComponentProps) {    
    return <Outlet />;
}