
import { useSuspenseQuery } from "@tanstack/react-query";
import { UserAvatar, userService, type UserProfile } from "~/entities/user";
import { useAuthStore } from "~/features/auth";

export const UserProfileCard = () => {

    const { user: authUser } = useAuthStore();

    const { data: user } = useSuspenseQuery({
        queryKey: ["user_profile", authUser?.userId],
        queryFn: () => userService.getUser(authUser!.userId),
    });
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5 max-w-2xl mx-auto">
            <div className="flex items-center gap-6">
                <UserAvatar src={user.img} name={user.name} size="lg" />
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                    <span className="text-lg text-gray-500 font-mono">#{user.nameTag}</span>
                </div>
            </div>
            
            <div className="h-[1px] bg-gray-100 w-full" />

            <div className="grid grid-cols-1 gap-6">
                <p className="text-gray-700 leading-relaxed">
                    {user.description || "No description provided."}
                </p>
                <span className="text-sm text-gray-400">
                    Member since: {new Date(user.createdAt!).toLocaleDateString()}
                </span>
            </div>
        </div>
    );
};