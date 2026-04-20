
import { useNavigate } from "react-router";
import type { LoginData } from "~/entities/session";
import { Separator, SocialMediaBlock, useAuthStore, validateEmail, validatePassword } from "~/features/auth";
import { useForm } from "~/shared/hooks";
import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";

const LoginPage = () => {
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
                const errorMessage = error instanceof Error ? error.message : "Unknown login error occurred";
                setErrors((prev) => ({ ...prev, password: errorMessage }));
            }
        },
    });
    return (
        <div className="max-w-md w-full bg-background border-border shadow-lg py-8 px-8 rounded font-normal">
            <h2 className="text-primary text-2xl font-medium w-full text-center mb-5">
                Login
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    type="email"
                    name="Email"
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
                <Button
                    variant="fill"
                    type="submit"
                    className="w-full py-3 font-medium text-xl my-2 bg-primary text-background"
                    disabled={isLoading}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </Button>
            </form>
            <div className="text-sm text-gray-400 mt-4 text-center">
                Don`t have an account?{"  "}
                <button
                    type="button"
                    className="cursor-pointer text-primary hover:text-primary-hover font-medium bg-transparent border-none p-0 underline-offset-2 hover:underline"
                    onClick={() => navigate("/auth/signup")}
                >
                    Sign Up
                </button>
            </div>
            <Separator> or </Separator>
            <SocialMediaBlock />
        </div>
    );
};

export default LoginPage;
