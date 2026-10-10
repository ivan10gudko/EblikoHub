import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { authService } from "~/entities/session";
import { useAuthStore } from "~/features/auth";
import { notify } from "~/shared/lib";

export const useAuthCallback = () => {
  const navigate = useNavigate();
  const syncOAuthUser = useAuthStore((state) => state.syncOAuthUser);

  const hasSynced = useRef(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (hasSynced.current) return;

      const {
        data: { session },
        error,
      } = await authService.getSession();

      if (error || !session) {
        notify.error("Login failed");
        navigate("/auth/login", { replace: true });
        return;
      }

      hasSynced.current = true;

      try {
        const metadata = session.user.user_metadata;
        const fallbackData = {
          name: metadata?.full_name || metadata?.name || "New User",
          username:
            metadata?.preferred_username ||
            metadata?.name ||
            `user_${Date.now()}`,
        };

        await syncOAuthUser(session.user.id, fallbackData);

        navigate("/profile", { replace: true });
      } catch (backendError) {
        notify.error("Authorization Synchronization Failed");
        navigate("/auth/login", { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate, syncOAuthUser]);
};
