import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";
import { useResetPassword } from "~/features/auth/hooks/useResetPassword";

const ResetPasswordForm = () => {
  const { password, error, isLoading, handleChange, handleBlur, handleSubmit } =
    useResetPassword();

  return (
    <div className="max-w-md w-full bg-background border-border shadow-lg py-8 px-8 rounded font-normal">
      <h2 className="text-primary text-2xl font-medium w-full text-center mb-2">
        New Password
      </h2>
      <p className="text-sm text-gray-400 text-center mb-6">
        Please enter your new secure password below.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="password"
          name="password"
          onChange={handleChange}
          onBlur={handleBlur}
          value={password}
          error={error}
          placeholder="Enter new password..."
        >
          New Password
        </Input>

        <Button
          variant="fill"
          type="submit"
          className="w-full py-3 font-medium text-xl my-2 bg-primary text-background shadow-[0_4px_0_0_#d97706] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Confirm Password"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
