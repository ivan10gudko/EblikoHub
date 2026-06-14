import { Button } from "~/shared/ui/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "react-router";
interface LogoutButtonProps {
  clickFallback?: () => void;
  classname?: string;
}
const LogoutButton = ({ clickFallback, classname }: LogoutButtonProps) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
    if (clickFallback) clickFallback();
  };
  const baseClassName =
    "w-full justify-start gap-4 py-3.5 px-5 border-danger/40 bg-danger/5 text-danger hover:bg-danger hover:text-white hover:border-danger transition-all duration-300 rounded-xl font-medium shadow-sm";

  return (
    <Button
      variant="outline"
      className={`${baseClassName} ${classname}`}
      onClick={handleLogout}
    >
      <LogoutIcon fontSize="small" className="rotate-180" />
      <span className="text-base tracking-wide">Log Out</span>
    </Button>
  );
};

export default LogoutButton;
