import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { friendshipService, type UserDtoWithFriendshipStatus } from "~/entities/friendship";
import { useFriendAction } from "~/entities/friendship/hooks/useFriendAction";
import { userService } from "~/entities/user";
import { useAuthStore } from "~/features/auth";
import { notify } from "~/shared/lib";

export const useUserProfile = (userId: string) => {
  const [isEditing, setIsEditing] = useState(false);
  const { userId: currentUserId } = useAuthStore();
  const queryClient = useQueryClient();

  const isOwn = Boolean(currentUserId && currentUserId === userId);
  const profileQueryKey = ["user_profile", userId];

  // 1. Запит профілю
  const { data: user } = useSuspenseQuery({
    queryKey: profileQueryKey,
    queryFn: async (): Promise<UserDtoWithFriendshipStatus> => {
      if (isOwn) {
        const profile = await userService.getUser(userId);
        return {
          ...profile,
          friendshipStatus: null,
          friendshipId: null,
        };
      }
      return friendshipService.getUserWithFriendshipStatus(userId);
    },
  });

  // 2. Дії з друзями
  const { onAction, isActionLoading } = useFriendAction({
    userId,
    currentUserId,
    profileQueryKey,
  });

  // 3. Мутація оновлення
  const updateMutation = useMutation({
    mutationFn: async ({
      profileData,
      avatarFile,
    }: {
      profileData: { name: string; description: string };
      avatarFile: File | null;
    }) => {
      const updateTextPromise = userService.updateUser(user.userId, profileData);

      if (avatarFile) {
        const updatePhotoPromise = userService.uploadAvatar(user.userId, avatarFile);
        return Promise.all([updateTextPromise, updatePhotoPromise]);
      }

      return updateTextPromise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey });
      setIsEditing(false);
      notify.success("Successfully updated");
    },
    onError: () => {
      notify.error("Failed to update profile");
    },
  });

  // Обчислювані значення (Derived state)
  const rawStatus = user.friendshipStatus;
  const friendshipStatus = rawStatus ? String(rawStatus).toUpperCase() : null;

  return {
    user,
    isOwn,
    isEditing,
    setIsEditing,
    friendshipStatus,
    friendshipId: user.friendshipId ?? null,
    onAction,
    isActionLoading,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};