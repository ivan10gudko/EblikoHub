import EditIcon from '@mui/icons-material/Edit';
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { UserAvatar, userService, type UserProfile } from "~/entities/user";
import { useAuthStore } from "~/features/auth";
import { Button } from "~/shared/ui/Button";
import { UserProfileEdit } from "./UserProfileEditCard";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

export const UserProfileCard = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { userId } = useAuthStore();
    const queryClient = useQueryClient();
    const navigate = useNavigate()


    const { data: user } = useSuspenseQuery({
        queryKey: ["user_profile", userId],
        queryFn: () => userService.getUser(userId!),
    });

    
    const updateMutation = useMutation({
    mutationFn: async ({ profileData, avatarFile }: { 
        profileData: { name: string; description: string }, 
        avatarFile: File | null 
    }) => {
        const updateTextPromise = userService.updateUser(user.userId, profileData);

        if (avatarFile) {
            const updatePhotoPromise = userService.uploadAvatar(user.userId, avatarFile);
            return Promise.all([updateTextPromise, updatePhotoPromise]);
        }

        return updateTextPromise;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user_profile", userId] });
        setIsEditing(false);
        toast.success("succesfully updated")
    },
    onError: (error) => {
        toast.error("failed to update profile");
    }
});
    return (
        <div className="bg-background rounded-3xl shadow-sm border border-border p-8 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />

            {!isEditing ? (
                <>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <UserAvatar src={user.img} name={user.name} size="lg" />
                        <div className="flex flex-col items-center sm:items-start grow">
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user.name}</h1>
                            <span className="text-lg text-primary font-mono">@{user.nameTag}</span>
                        </div>
                        <Button
                            onClick={() => setIsEditing(true)} 
                            className="bg-background-muted hover:bg-background-muted-hover text-card hover:text-primary-hover p-3 rounded-2xl transition-all"
                        >
                            <EditIcon className='text-primary'/>
                        </Button>
                    </div>
                    
                    <div className="h-[1px] bg-background-muted w-full" />
                    
                    <p className="text-foreground leading-relaxed">
                        {user.description || "No description provided yet. Let people know who you are!"}
                    </p>
                </>
            ) : (
                <UserProfileEdit 
                    user={user} 
                    onSave={(data, file) => updateMutation.mutate({ 
                        profileData: data, 
                        avatarFile: file 
                        })}
                    onCancel={() => setIsEditing(false)}
                    isPending={updateMutation.isPending}
                />
            )}
        </div>
    );
};