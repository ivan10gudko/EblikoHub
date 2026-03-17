import { supabase } from "~/shared/lib/supabase";
import { useAuthStore } from "~/features/auth/store/auth.store";
import MainLayout from "~/core/layouts/MainLayout";
import Loader from "~/shared/ui/Loader/Loader";
import type { Route } from "./+types/_main";

export async function clientLoader() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user?.id) {
        useAuthStore.getState().restoreSession(session.user.id).catch(console.error);
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

export default function MainRoute({ loaderData }: Route.ComponentProps) {
    return <MainLayout session={loaderData?.session ?? null} />;
}