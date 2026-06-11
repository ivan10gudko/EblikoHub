import { notify } from "~/shared/lib";
import { validateEmail } from "../utils/validators";
import { authService } from "~/entities/session/api/AuthService";
import type { LoginData } from "~/entities/session/model/session.types";
import { useNavigate } from "react-router";

export const useForgotPassword = ({
  formData,
  setErrors,
}: {
  formData: { email: string };
  setErrors: (
    value: React.SetStateAction<Partial<Record<keyof LoginData, string>>>,
  ) => void;
}) => {
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    const emailValue = formData.email;
    const emailError = validateEmail(emailValue);

    if (!emailValue.trim() || emailError) {
      notify.error(emailError || "Please enter a valid email address first!");
      setErrors((prev) => ({
        ...prev,
        email: emailError || "Required for password reset",
      }));
      return;
    }

    const resetnotify = notify.loading("Sending reset link...");

    try {
      await authService.sendPasswordResetEmail(emailValue);

      navigate("reset-password/sent");
      notify.updateSuccess(resetnotify, "Reset link sent! Check your email.");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      notify.updateError(resetnotify, errorMessage);
    }
  };

  return { handleForgotPassword };
};
