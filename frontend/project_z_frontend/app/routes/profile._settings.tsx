import { Outlet, redirect, useParams } from "react-router";
import { ensureAuthenticated } from "~/features/auth";
import type { Route } from "./+types/profile._settings";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const currentUserId = await ensureAuthenticated();
  const targetUserId = params.userId;

  if (!currentUserId) {
    return redirect("/auth/login");
  }

  if (targetUserId !== currentUserId) {
    return redirect(`/profile/${targetUserId}`);
  }

  return null;
}

export default function ProfileSettingsRoute() {
  return (
    <main className="max-w-3xl mx-auto p-4 md:p-10 bg-background rounded-2xl w-full">
      <Outlet />
    </main>
  );
}
