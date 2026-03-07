import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "~/lib/supabase";

const AuthCallback = () => {
    const navigate = useNavigate();
    useEffect(() => {
    const handleAuthCallback = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
            console.error("Login failed", error);
            navigate("/auth/login");
            return;
        }

        try {
        // 2. Логіка AuthService
        // перевіряємо, чи є такий юзер в бд, якщо ні - реєструємо
        // потім додаємо в zustand store
        navigate("/dashboard", { replace: true });

        } catch (backendError) {
            console.error("Authorization Synchronization Failed", backendError);
        }
    };

    }, [navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <p className="bg-white text-4xl px-12 py-10 rounded-lg">
                Finalizing login...
            </p>
        </div>
    );
}

export default AuthCallback;