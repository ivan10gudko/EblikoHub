import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { supabase } from "~/shared/lib/supabase";
import { useAuthStore } from "~/features/auth/store/auth.store";

const AuthCallbackPage = () => {
    const navigate = useNavigate();
    const syncOAuthUser = useAuthStore((state) => state.syncOAuthUser);
    
    const hasSynced = useRef(false);

    useEffect(() => {
        const handleAuthCallback = async () => {
            if (hasSynced.current) return;

            const { data: { session }, error } = await supabase.auth.getSession();

            if (error || !session) {
                console.error("Login failed", error);
                navigate("/auth/login", { replace: true });
                return;
            }

            hasSynced.current = true;

            try {
                const metadata = session.user.user_metadata;
                const fallbackData = {
                    name: metadata?.full_name || metadata?.name || "New User",
                    username: metadata?.preferred_username || metadata?.name || `user_${Date.now()}`,
                };

                await syncOAuthUser(session.user.id, fallbackData);

                navigate("/profile", { replace: true });

            } catch (backendError) {
                console.error("Authorization Synchronization Failed", backendError);
                navigate("/auth/login", { replace: true });
            }
        };

        handleAuthCallback();

    }, [navigate, syncOAuthUser]);

    return (
        <div className="flex justify-center items-center h-screen bg-slate-50">
            <p className="bg-white text-4xl px-12 py-10 rounded-lg shadow-lg font-medium text-amber-300">
                Finalizing login...
            </p>
        </div>
    );
}

export default AuthCallbackPage;