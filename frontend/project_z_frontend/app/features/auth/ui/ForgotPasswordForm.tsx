import { useForm } from "~/shared/hooks";
import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";
import { validateEmail } from "../utils/validators";
import { useAuthStore } from "../store/auth.store";
import { useForgotPassword } from "../hooks/useForgotPassword";

const ForgotPasswordForm = () => {
  const isLoading = useAuthStore((state) => state.isLoading);

  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldStatus,
    setErrors,
  } = useForm<{ email: string }>({
    initialValues: { email: "" },
    validate: (name, value) => {
      switch (name) {
        case "email":
          return validateEmail(value);
        default:
          return undefined;
      }
    },
    onSubmit: () => handleForgotPassword(),
  });

  const { handleForgotPassword } = useForgotPassword({
    formData,
    setErrors,
  });

  return (
    <div className="max-w-md w-full bg-background border-border shadow-lg py-8 px-8 rounded font-normal">
      <h2 className="text-primary text-2xl font-medium w-full text-center mb-5">
        Forgot Password
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
        <Button
          variant="fill"
          type="submit"
          className="w-full py-3 font-medium text-xl my-2 bg-primary text-background"
          disabled={isLoading}
        >
          {isLoading ? "Sending reset link..." : "Send Reset Link"}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
