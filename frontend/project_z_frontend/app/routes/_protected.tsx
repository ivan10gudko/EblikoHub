import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/_protected";
import { Loader } from "~/shared/ui/Loader";
import { ensureAuthenticated } from "~/features/auth";

export async function clientLoader() {
    const userId = await ensureAuthenticated();

    if (!userId) {
        throw redirect("/auth/login");
    }

    return { userId };
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