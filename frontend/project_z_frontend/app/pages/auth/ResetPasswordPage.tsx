import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";
import { validatePassword } from "~/features/auth";
import { notify, supabase } from "~/shared/lib";

const ResetPasswordPage = () => {
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
        const toastId = notify.loading("Updating your password...");

        try {

            const { error: supabaseError } = await supabase.auth.updateUser({
                password: password,
            });

            if (supabaseError) {
                notify.updateError(toastId,supabaseError.message);
            } else {
                notify.updateSuccess( toastId,"Password updated successfully! Please log in.");

                await supabase.auth.signOut();

                navigate("/auth/login");
            }
        } catch (err) {
            notify.updateError(toastId, "An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full bg-background border-border shadow-lg py-8 px-8 rounded font-normal">
            <h2 className="text-primary text-2xl font-medium w-full text-center mb-2">
                New Password
            </h2>
            <p className="text-sm text-gray-400 text-center mb-6">
                Please enter your new secure password below.
            </p>

            <form onSubmit={handleConfirmReset} className="flex flex-col gap-4">
                <Input
                    type="password"
                    name="password"
                    onChange={handlePasswordChange}
                    value={password}
                    error={error}
                    placeholder="Enter new password..."
                >
                    New Password
                </Input>

                <Button
                    variant="fill"
                    type="submit"
                    className="w-full py-3 font-medium text-xl my-2 bg-primary text-background shadow-[0_4px_0_0_#d97706] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? "Saving..." : "Confirm Password"}
                </Button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;