import { notify } from "~/shared/lib";
import { validatePassword } from "../utils/validators";
import { useNavigate } from "react-router";
import { useForm } from "~/shared/hooks";
import { useAuthStore } from "../store/auth.store";

export interface ResetPasswordData {
    password: string;
}
export const useResetPassword = () => {
    const navigate = useNavigate();
    const updatePassword = useAuthStore((state) => state.updatePassword);
    const isLoading = useAuthStore((state) => state.isLoading);

    const {
        formData,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        getFieldStatus,
    } = useForm<ResetPasswordData>({
        initialValues: { password: "" },
        validate: (name, value) => {
            if (name === "password") return validatePassword(value);
            return undefined;
        },
        onSubmit: async (values) => {
            const updateNotifyId = notify.loading("Updating your password...");
            try {
                await updatePassword(values.password);
                notify.updateSuccess(updateNotifyId, "Password updated successfully! Please log in.");
                navigate("/auth/login");
            } catch {
                notify.updateError(updateNotifyId, "Failed to update password");
            }
        },
    });

    return {
        password: formData.password,
        error: touched.password ? errors.password : undefined,
        isLoading,
        handleChange: handleChange("password"),
        handleBlur: handleBlur("password"),
        handleSubmit,
        getFieldStatus: getFieldStatus("password"),
    };
};