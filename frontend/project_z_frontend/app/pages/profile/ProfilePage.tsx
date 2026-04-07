import { Suspense, useState } from "react";
import { UserProfileSidebar } from "~/widgets/UserProfileSidebar"; 
import { UserProfileCard, UserProfileCardSkeleton } from "~/widgets/UserProfileCard"; 
import { Button } from "~/shared/ui/Button";
import MenuIcon from '@mui/icons-material/Menu';
 export const ProfilePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-8rem)] relative w-[90%] sm:gap-8 mx-auto my-8">
            <UserProfileSidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />
            <main className="flex-1 p-4 md:p-10 flex flex-col items-center justify-start">
                <div className="w-full max-w-2xl">
                    
                    <div className="md:hidden mb-4 flex justify-start">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsSidebarOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white shadow-sm border-gray-200 text-gray-700 rounded-xl"
                        >
                            <MenuIcon fontSize="small" />
                            <span className="font-medium">Menu</span>
                        </Button>
                    </div>

                    <Suspense fallback={<UserProfileCardSkeleton />}>
                        <UserProfileCard />
                    </Suspense>
                </div>
            </main>
        </div>
    );
};
export default ProfilePage