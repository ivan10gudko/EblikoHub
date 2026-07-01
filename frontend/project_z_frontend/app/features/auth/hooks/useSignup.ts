
import { useNavigate } from "react-router";
import type { RegisterData } from "~/entities/session";
import { userService } from "~/entities/user";
import {
    useAuthStore,
    validateEmail,
    validateName,
    validatePassword,
    validateUsername,
} from "~/features/auth";
import { useForm } from "~/shared/hooks";

interface RegisterFormData extends RegisterData {
    confirmPassword: string;
}

const INITIAL_VALUE = {
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export const useSignup = () => {
    const signUpWithEmail = useAuthStore((state) => state.signUpWithEmail);
    const isLoading = useAuthStore((state) => state.isLoading);
    const navigate = useNavigate();

    const {
        formData,
        errors,
        touched,
        handleChange: baseHandleChange,
        handleBlur,
        handleSubmit,
        getFieldStatus,
        setErrors,
    } = useForm<RegisterFormData>({
        initialValues: INITIAL_VALUE,
        validate: (name, value, currentValues) => {
            switch (name) {
                case "name":
                    return validateName(value);
                case "username":
                    return validateUsername(value);
                case "email":
                    return validateEmail(value);
                case "password":
                    return validatePassword(value);
                case "confirmPassword":
                    if (!value) return "Please confirm your password";
                    if (value !== currentValues.password) return "Passwords do not match";
                    return undefined;
                default:
                    return undefined;
            }
        },
        onSubmit: async (values) => {
            try {
                await signUpWithEmail({
                    name: values.name,
                    username: values.username,
                    email: values.email,
                    password: values.password,
                });
                navigate("/");
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : "Registration failed";
                setErrors((prev) => ({ ...prev, confirmPassword: errorMessage }));
            }
        },
    });

    const handleCheckAvailability = async (value: string) => {
        if (!value) return;
        try {
            const isAvailable = await userService.isNameTagAvailable(value);
            if (!isAvailable) {
                setErrors((prev) => ({
                    ...prev,
                    username: `This username is already taken`,
                }));
            }
        } catch {
            console.error("Server error");
        }
    };

    const handleChange = (name: keyof RegisterFormData) => (value: string) => {
        baseHandleChange(name)(value);

        if (name === "username") {
            handleCheckAvailability(value);
        }

        if (name === "password" && touched.confirmPassword) {
            const error =
                formData.confirmPassword !== value
                    ? "Passwords do not match"
                    : undefined;
            setErrors((prev) => ({ ...prev, confirmPassword: error }));
        }
    };

    return {
        formData,
        errors,
        touched,
        handleChange,
        handleBlur,
        getFieldStatus,
        handleSubmit,
        isLoading,
    };
};