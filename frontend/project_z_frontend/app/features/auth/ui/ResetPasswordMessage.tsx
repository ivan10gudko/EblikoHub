const ResetPasswordMessage = () => {
  return (
    <div className="flex flex-col items-center gap-4 bg-background/80 border-border shadow-lg py-8 px-8 rounded-md font-normal text-center max-w-md w-full">
      <h2 className="text-2xl font-bold">Password Reset Email Sent</h2>
      <p className="text-foreground">
        If an account with the provided email exists, you will receive an email
        with instructions to reset your password.
      </p>
    </div>
  );
};

export default ResetPasswordMessage;
