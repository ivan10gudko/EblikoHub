import { Suspense, useState, useEffect } from "react";
import { useParams, useNavigate, Outlet } from "react-router";
import { useAuthStore } from "~/features/auth";
import { UserProfileSidebar } from "~/widgets/UserProfileSidebar";
import { UserProfileCardSkeleton } from "~/widgets/UserProfileCard";
import { Button } from "~/shared/ui/Button";
import MenuIcon from "@mui/icons-material/Menu";

const ProfileLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { userId: currentUserId } = useAuthStore();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId && currentUserId) {
      navigate(`/profile/${currentUserId}`, { replace: true });
    }
  }, [userId, currentUserId, navigate]);

  const targetUserId = userId || currentUserId;

  if (!targetUserId) {
    return (
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-8rem)] relative w-[90%] sm:gap-8 mx-auto my-8">
        <div className="w-72 bg-background border-r border-border rounded-2xl animate-pulse" />
        <main className="flex-1 p-4 md:p-10 flex flex-col items-center justify-start">
          <div className="w-full max-w-2xl">
            <UserProfileCardSkeleton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-8rem)] relative w-[90%] sm:gap-8 mx-auto my-8">
      <UserProfileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userId={targetUserId}
      />
      <main className="flex-1 p-4 md:p-10 flex flex-col items-center justify-start">
        <div className="w-full max-w-2xl">
          <div className="md:hidden mb-4 flex justify-start">
            <Button
              variant="outline"
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-background shadow-sm border-border text-foreground-muted rounded-xl"
            >
              <MenuIcon fontSize="small" />
              <span className="font-medium">Menu</span>
            </Button>
          </div>

          <Suspense fallback={<UserProfileCardSkeleton />}>
            <Outlet context={{ userId: targetUserId }} />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default ProfileLayout;
