import { useNavigate } from "react-router";
import { type LoginData } from "~/entities/session";
import {
    useAuthStore,
    validateEmail,
    validatePassword,
} from "~/features/auth";
import { useForm } from "~/shared/hooks";
import { useForgotPassword } from "./useForgotPassword";

export const useLogin = () => {
    const loginWithEmail = useAuthStore((state) => state.loginWithEmail);
    const isLoading = useAuthStore((state) => state.isLoading);
    const navigate = useNavigate();

    const {
        formData,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        getFieldStatus,
        setErrors,
    } = useForm<LoginData>({
        initialValues: { email: "", password: "" },

        validate: (name, value) => {
            switch (name) {
                case "email":
                    return validateEmail(value);
                case "password":
                    return validatePassword(value);
                default:
                    return undefined;
            }
        },
        onSubmit: async (values) => {
            try {
                await loginWithEmail(values.email, values.password);
                navigate("/");
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Unknown login error occurred";
                setErrors((prev) => ({ ...prev, password: errorMessage }));
            }
        },
    });

    const { handleForgotPassword } = useForgotPassword({
        formData,
        setErrors,
    });

    return {
        formData,
        errors,
        touched,
        isLoading,
        handleChange,
        handleBlur,
        handleSubmit,
        getFieldStatus,
        handleForgotPassword
    };
};