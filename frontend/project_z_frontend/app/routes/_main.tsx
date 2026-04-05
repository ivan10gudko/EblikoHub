import { supabase } from "~/shared/lib/supabase";
import { useAuthStore } from "~/features/auth/store/auth.store";
import MainLayout from "~/core/layouts/MainLayout";
import Loader from "~/shared/ui/Loader/Loader";
import type { Route } from "./+types/_main";
import type { ShouldRevalidateFunctionArgs } from "react-router";

export async function clientLoader() {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user?.id) {
        useAuthStore.getState().restoreSession(session.user.id).catch(console.error);
    }

    return { session };
}
export function shouldRevalidate({ currentUrl, nextUrl, defaultShouldRevalidate }: ShouldRevalidateFunctionArgs) {
    if (currentUrl.pathname === nextUrl.pathname) {
        return false;
    }
    return defaultShouldRevalidate;
}
export function HydrateFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader />
        </div>
    );
}

export default function MainRoute({ loaderData }: Route.ComponentProps) {
    return <MainLayout />;
}