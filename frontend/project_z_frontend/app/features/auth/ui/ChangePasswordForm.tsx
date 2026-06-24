import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";
import { useChangePassword } from "../hooks/useChangePassword";
import { Link } from "react-router";

const ChangePasswordForm = () => {
  const {
    formData,
    errors,
    touched,
    isLoading,
    handleSubmit,
    handleChange,
    handleBlur,
    getFieldStatus,
  } = useChangePassword();

  return (
    <div className="max-w-md w-full bg-background border-border shadow-lg py-8 px-8 rounded font-normal">
      <h2 className="text-primary text-2xl font-medium w-full text-center mb-5">
        Change Password
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="password"
          name="currentPassword"
          onChange={handleChange("currentPassword")}
          value={formData.currentPassword}
          onBlur={handleBlur("currentPassword")}
          error={touched.currentPassword ? errors.currentPassword : undefined}
          isValid={getFieldStatus("currentPassword")}
        >
          Current Password
        </Input>
        <Input
          type="password"
          name="newPassword"
          onChange={handleChange("newPassword")}
          value={formData.newPassword}
          onBlur={handleBlur("newPassword")}
          error={touched.newPassword ? errors.newPassword : undefined}
          isValid={getFieldStatus("newPassword")}
        >
          New Password
        </Input>

        <Button
          variant="fill"
          type="submit"
          className="w-full py-3 font-medium text-xl my-2 bg-primary text-background"
          disabled={isLoading}
        >
          {isLoading ? "Changing password..." : "Change Password"}
        </Button>
        <Link
          to="/auth/forgot-password"
          className="text-sm text-gray-400 mt-4 hover:text-primary/80 transition-colors"
        >
          Forgot password
        </Link>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
