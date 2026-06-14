import { notify } from "~/shared/lib";
import { validatePassword } from "../utils/validators";
import { useNavigate } from "react-router";
import { useForm } from "~/shared/hooks";
import { useAuthStore } from "../store/auth.store";

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

export const useChangePassword = () => {
    const navigate = useNavigate();
    const changePassword = useAuthStore((state) => state.changePassword);
    const isLoading = useAuthStore((state) => state.isLoading);

    const {
        formData,
        errors,
        touched,
        setErrors,
        handleChange,
        handleBlur,
        handleSubmit,
        getFieldStatus,
    } = useForm<ChangePasswordData>({
        initialValues: { currentPassword: "", newPassword: "" },
        validate: (name, value, currentValues) => {
            if (name === "currentPassword") return validatePassword(value);
            if (name === "newPassword") {
                if (!value) return "Please confirm your new password";
                if (value === currentValues.currentPassword) {
                    return "New password cannot be the same as the current password.";
                }
                return validatePassword(value);
            }

            return undefined;
        },
        onSubmit: async (values) => {
            const updateNotifyId = notify.loading("Updating your password...");

            try {
                await changePassword(values.currentPassword, values.newPassword);

                notify.updateSuccess(updateNotifyId, "Password updated successfully!");
                navigate("/profile");
            } catch (err) {
                notify.updateError(updateNotifyId, "Failed to update password");
            }
        },
    });


    return {
        formData,
        errors,
        touched,
        isLoading,
        handleChange: handleChange,
        handleBlur: handleBlur,
        handleSubmit,
        getFieldStatus: getFieldStatus,
    };
};