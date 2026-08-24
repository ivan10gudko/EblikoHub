import { notify } from "~/shared/lib";
import { userService } from "../../../entities/user/api/UserService";
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";

interface UseProfileUpdateProps {
    userId: string;
    invalidateKey: QueryKey;
}

export const useProfileUpdate = ({ userId, invalidateKey }: UseProfileUpdateProps) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            profileData,
            avatarFile,
        }: {
            profileData: { name: string; description: string };
            avatarFile: File | null;
        }) => {
            const updateTextPromise = userService.updateUser(userId, profileData);

            if (avatarFile) {
                const updatePhotoPromise = userService.uploadAvatar(userId, avatarFile);
                return Promise.all([updateTextPromise, updatePhotoPromise]);
            }

            return updateTextPromise;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: invalidateKey });
            notify.success("Successfully updated");
        },
        onError: () => {
            notify.error("Failed to update profile");
        },
    });
}