
import { useNavigate } from "react-router";
import type { RegisterData } from "~/entities/session";
import { userService } from "~/entities/user";
import { Separator, SocialMediaBlock, useAuthStore, validateEmail, validateName, validatePassword, validateUsername } from "~/features/auth";
import { useForm } from "~/shared/hooks";
import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";

interface RegisterFormData extends RegisterData {
    confirmPassword: string;
}

const INITIAL_VALUE =  {
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const SignupPage = () => {
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
                const errorMessage = error instanceof Error ? error.message : "Registration failed";
                setErrors((prev) => ({ ...prev, confirmPassword: errorMessage }));
            }
        },
    });

    const handleCheckAvailability = async (value: string) => {
        if (!value) return;
        try {
            const isAvailable = await userService.isNameTagAvailable(value);
            if (!isAvailable) {
                setErrors((prev) => ({ ...prev, username: `This username is already taken` }));
            }
        } catch (error) {
            console.error("Server error");
        }
    };

    const handleChange = (name: keyof RegisterFormData) => (value: string) =>{
        baseHandleChange(name)(value);
        
        if (name === "username") {
            handleCheckAvailability(value);
        }
        
        if (name === "password" && touched.confirmPassword) {
            const error = formData.confirmPassword !== value ? "Passwords do not match" : undefined;
            setErrors((prev) => ({ ...prev, confirmPassword: error }));
        }
    };
    return (
        <div className="max-w-md w-full bg-white border-slate-200 shadow-lg py-6 px-8 rounded font-normal">
            <h2 className="text-amber-300 text-2xl font-medium w-full text-center mb-5">
                Sign Up
            </h2>
            <form onSubmit={handleSubmit} noValidate>
                <Input
                    type="text"
                    name="name"
                    onChange={handleChange("name")}
                    value={formData.name}
                    onBlur={handleBlur("name")}
                    error={touched.name ? errors.name : undefined}
                    isValid={getFieldStatus("name")}
                >
                    Name
                </Input>

                <Input
                    type="text"
                    name="username"
                    onChange={handleChange("username")}
                    value={formData.username}
                    onBlur={handleBlur("username")}
                    error={touched.username ? errors.username : undefined}
                    isValid={getFieldStatus("username")}
                >
                    Username
                </Input>

                <Input
                    type="email"
                    name="email"
                    onChange={handleChange("email")}
                    value={formData.email}
                    onBlur={handleBlur("email")}
                    error={touched.email ? errors.email : undefined}
                    isValid={getFieldStatus("email")}
                >
                    Email
                </Input>

                <Input
                    type="password"
                    name="password"
                    onChange={handleChange("password")}
                    value={formData.password}
                    onBlur={handleBlur("password")}
                    error={touched.password ? errors.password : undefined}
                    isValid={getFieldStatus("password")}
                >
                    Password
                </Input>

                <Input
                    type="password"
                    name="confirmPassword"
                    onChange={handleChange("confirmPassword")}
                    value={formData.confirmPassword}
                    onBlur={handleBlur("confirmPassword")}
                    error={
                        touched.confirmPassword
                            ? errors.confirmPassword
                            : undefined
                    }
                    isValid={getFieldStatus("confirmPassword")}
                >
                    Confirm password
                </Input>

                <Button
                    variant="fill"
                    htmlType="submit"
                    className="w-full py-3 font-medium text-xl my-2"
                    bgColor="var(--color-amber-300)"
                    color="white"
                    disabled={isLoading}
                >
                    {isLoading ? "Signing up..." : "Sign Up"}
                </Button>
            </form>

            <div className="text-sm text-gray-400 mt-4 text-center">
                Already have an account?{"  "}
                <button
                    type="button"
                    className="cursor-pointer text-amber-300 hover:text-amber-200 font-medium bg-transparent border-none p-0 underline-offset-2 hover:underline"
                    onClick={() => navigate("/auth/login")}
                >
                    Log in
                </button>
            </div>

            <Separator> or </Separator>
            <SocialMediaBlock />
        </div>
    );
};

export default SignupPage;
