import { redirect, useParams } from "react-router";
import { useAuthStore } from "~/features/auth/store/auth.store";
import type { Route } from "./+types/profile.settings";
import { ensureAuthenticated } from "~/features/auth/model/ensureAuthenticated";

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
  return <div>User settings</div>;
}
