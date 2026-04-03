import { redirect } from "react-router";
import { userService } from "~/entities/user";
import { useAuthStore } from "~/features/auth";
import { ProfilePage } from "~/pages/profile";
import { queryClient } from "~/shared/lib";

export const clientLoader = () => {
  const { userId } = useAuthStore.getState();

  if (!userId) {
    return redirect("/auth/login")
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