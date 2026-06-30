import { redirect } from "react-router";

import { userService } from "~/entities/user/api/UserService";
import { queryClient } from "~/shared/lib/queryClient";
import { ensureAuthenticated } from "~/features/auth";

export const clientLoader = async () => {
  const userId = await ensureAuthenticated();

  if (!userId) {
    return redirect("/auth/login");
  }

  queryClient.prefetchQuery({
    queryKey: ["user_profile", userId],
    queryFn: () => userService.getUser(userId),
  });

  return redirect(userId);
};
