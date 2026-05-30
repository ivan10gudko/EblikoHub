import { notify } from "~/shared/lib";
import { validatePassword } from "../utils/validators";
import { useNavigate } from "react-router";
import { useState } from "react";
import { authService } from "~/entities/session";

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
            await authService.updatePassword(password);

            notify.updateSuccess(updateNotifyId, "Password updated successfully! Please log in.");

            await authService.logout();

            navigate("/auth/login");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
            notify.updateError(updateNotifyId, errorMessage);
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