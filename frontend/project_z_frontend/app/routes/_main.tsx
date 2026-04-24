import MainLayout from "~/core/layouts/MainLayout";
import Loader from "~/shared/ui/Loader/Loader";
import type { Route } from "./+types/_main";
import { ensureAuthenticated } from "~/features/auth";
import { isRouteErrorResponse, useRouteError, type ShouldRevalidateFunctionArgs } from "react-router";
import { ErrorScreen } from "~/shared/ui/ErrorScreen/ErrorScreen";

export async function clientLoader() {
    const userId = await ensureAuthenticated();

    return userId;
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
export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <ErrorScreen
                status={error.status}
                title={error.status === 404 ? "Page Not Found" : "Server Error"}
                message={error.status === 404
                    ? "The page you are looking for doesn't exist or has been moved."
                    : error.data?.message || "An unexpected error occurred on our side."
                }
            />
        );
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown application error";

    return (
        <ErrorScreen
            title="Application Crash"
            message="Something went seriously wrong in the app's code."
            stack={errorMessage}
            onRetry={() => window.location.href = "/"} 
        />
    );
}