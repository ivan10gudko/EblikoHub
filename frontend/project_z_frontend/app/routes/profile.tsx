import { redirect } from "react-router";
import { userService } from "~/entities/user";
import { ensureAuthenticated, useAuthStore } from "~/features/auth";
import { ProfilePage } from "~/pages/profile";
import { queryClient, supabase } from "~/shared/lib";

export const clientLoader = async () => {
    const userId = await ensureAuthenticated();

    if (!userId) {
        return redirect("/auth/login");
    }

    queryClient.prefetchQuery({
        queryKey: ["user_profile", userId],
        queryFn: () => userService.getUser(userId),
    });

    return null;
};
export default function ProfileRoute() {
    return <ProfilePage />;
}
