import { useState } from "react";
import { useFriendAction } from "~/features/manageFriends/hooks/useFriendAction";
import { useAuthStore } from "~/features/auth";
import { useProfileQuery, useProfileUpdate } from "~/features/profile";

export const useUserProfile = (userId: string) => {
  const [isEditing, setIsEditing] = useState(false);
  const { userId: currentUserId } = useAuthStore();

  const profileQueryKey = ["user_profile", userId];
  const isOwn = Boolean(currentUserId && currentUserId === userId);

  const { user } = useProfileQuery({
    userId,
    isOwn,
    profileQueryKey,
  });

  const { onAction, isActionLoading } = useFriendAction({
    userId,
    currentUserId,
    profileQueryKey,
  });

  const { mutate: updateProfile, isPending: isUpdating } = useProfileUpdate({
    userId,
    invalidateKey: profileQueryKey
  });



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
    updateProfile,
    isUpdating,
  };
};