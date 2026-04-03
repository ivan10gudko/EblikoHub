import { useNavigate, NavLink } from "react-router";
import { useAuthStore } from "~/features/auth";
import { Button } from "~/shared/ui/Button";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton, Divider } from "@mui/material";
import { Sidebar } from "~/shared/ui/Sidebar";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UserProfileSidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/auth/login");
        onClose();
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity backdrop-blur-[2px]"
                    onClick={onClose}
                />
            )}
            <Sidebar>
                <div className="flex flex-col h-full p-4">
                    <div className="flex justify-between items-center mb-6 md:hidden">
                        <IconButton onClick={onClose} size="medium">
                            <CloseIcon />
                        </IconButton>
                    </div>

                    <nav className="flex flex-col gap-1">
                        <NavLink
                            to="/profile"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                    isActive
                                        ? "bg-yellow-400 text-white shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`
                            }
                        >
                            <PersonOutlineIcon fontSize="small" />
                            <span className="text-xl">Profile</span>
                        </NavLink>
                    </nav>

                    <div className="mt-auto pt-4">
                        <Divider sx={{ mb: 2 }} />
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-3 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
                            onClick={handleLogout}
                        >
                            <LogoutIcon fontSize="small" />
                            Log Out
                        </Button>
                    </div>
                </div>
            </Sidebar>
        </>
    );
};
