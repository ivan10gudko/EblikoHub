import { useNavigate } from "react-router";
import { Separator, SocialMediaBlock, validateEmail } from "~/features/auth";
import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";
import { useLogin } from "../hooks/useLogin";

const LoginForm = () => {
  const navigate = useNavigate();
  const {
    formData,
    errors,
    touched,
    isLoading,
    handleSubmit,
    handleChange,
    handleBlur,
    getFieldStatus,
    handleForgotPassword,
  } = useLogin();

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
      <div className="items-center flex flex-col">
        <div className="text-sm text-gray-400 mt-4">
          Don`t have an account?{"  "}
          <button
            type="button"
            className="cursor-pointer text-primary hover:text-primary-hover font-medium bg-transparent border-none p-0 underline-offset-2 hover:underline"
            onClick={() => navigate("/auth/signup")}
          >
            Sign Up
          </button>
        </div>
        <div className="text-sm text-gray-400 mt-4">
          Forgot password? {"  "}
          <button
            type="button"
            className="cursor-pointer text-primary hover:text-primary-hover font-medium bg-transparent border-none p-0 underline-offset-2 hover:underline"
            onClick={handleForgotPassword}
          >
            Reset
          </button>
        </div>
      </div>
      <Separator> or </Separator>
      <SocialMediaBlock />
    </div>
  );
};

export default LoginForm;
