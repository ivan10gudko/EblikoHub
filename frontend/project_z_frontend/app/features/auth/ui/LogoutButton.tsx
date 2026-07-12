import { Button } from "~/shared/ui/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "react-router";
import { cn } from "~/shared/lib/utils";
interface LogoutButtonProps {
  clickFallback?: () => void;
  className?: string;
}
const LogoutButton = ({ clickFallback, className }: LogoutButtonProps) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
    if (clickFallback) clickFallback();
  };

  return (
    <Button
      variant="destructive"
      className={cn(
        "w-full justify-start gap-4 px-5 py-3.5 text-base tracking-wide rounded-xl",
        className,
      )}
      onClick={handleLogout}
    >
      <LogoutIcon fontSize="small" className="rotate-180" />
      <span>Log Out</span>
    </Button>
  );
};

export default LogoutButton;
