import { notify, supabase } from "~/shared/lib";
import { validatePassword } from "../utils/validators";
import { useNavigate } from "react-router";
import { useState } from "react";

export const useResetPassword = () => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handlePasswordChange = (val: string) => {
        setPassword(val);
        setError(validatePassword(val));
    };

    const handleConfirmReset = async (e: React.FormEvent) => {
        e.preventDefault();

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            notify.error(passwordError);
            return;
        }

        setIsLoading(true);
        const updateNotifyId = notify.loading("Updating your password...");

        try {
            const { error: supabaseError } = await supabase.auth.updateUser({
                password: password,
            });

            if (supabaseError) {
                notify.updateError(updateNotifyId, supabaseError.message);
            } else {
                notify.updateSuccess(updateNotifyId, "Password updated successfully! Please log in.");

                await supabase.auth.signOut();
                navigate("/auth/login");
            }
        } catch (err) {
            notify.updateError(updateNotifyId, "An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        password,
        error,
        isLoading,
        handlePasswordChange,
        handleConfirmReset,
    };
};