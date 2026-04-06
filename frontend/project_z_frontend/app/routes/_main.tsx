import MainLayout from "~/core/layouts/MainLayout";
import Loader from "~/shared/ui/Loader/Loader";
import type { Route } from "./+types/_main";
import { ensureAuthenticated } from "~/features/auth";

export async function clientLoader() {
    const userId = await ensureAuthenticated();
    
    return userId;
}

export function HydrateFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader />
        </div>
    );
}

export default function MainRoute({ loaderData }: Route.ComponentProps) {
    return <MainLayout/>;
}