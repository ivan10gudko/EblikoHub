import { useAuthCallback } from "~/features/auth";

const AuthCallbackPage = () => {
  useAuthCallback();
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-background text-4xl px-12 py-10 rounded-lg shadow-lg font-medium ">
        Finalizing login...
      </p>
    </div>
  );
};

export default AuthCallbackPage;
