import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { type WithFriendship } from "~/entities/friendship";
import { useFriends } from "~/features/manageFriends/hooks/useFriends";
import type { FriendActionType } from "~/features/manageFriends/types/friends.types";
import type { UserProfileWithFavorite } from "~/features/profile";
import { notify } from "~/shared/lib";
import { RequestStatus } from "~/shared/types";
import { getErrorMessage } from "~/shared/utils";

interface UseFriendActionProps {
  userId: string;
  currentUserId: string | null;
  profileQueryKey: QueryKey;
}

export const useFriendAction = ({
  userId,
  currentUserId,
  profileQueryKey,
}: UseFriendActionProps) => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const queryClient = useQueryClient();
  const { handleFriendAction } = useFriends(currentUserId || "", "add");

  const onAction = async (action: FriendActionType, targetId: string) => {
    if (isActionLoading) return;
    setIsActionLoading(true);

    queryClient.setQueryData<WithFriendship<UserProfileWithFavorite> | undefined>(
      profileQueryKey,
      (oldData) => {
        if (!oldData) return oldData;
        if (action === "send") {
          return { ...oldData, friendshipStatus: RequestStatus.PENDING };
        }
        if (action === "delete") {
          return {
            ...oldData,
            friendshipStatus: RequestStatus.NONE,
            friendshipId: null,
          };
        }
        return oldData;
      }
    );

    try {
      if (action === "send") {
        await handleFriendAction("send", userId);
      } else {
        await handleFriendAction(action, targetId);
      }

      await queryClient.invalidateQueries({ queryKey: profileQueryKey });
    } catch (error: unknown) {
      const isConflict = axios.isAxiosError(error) && error.response?.status === 409;

      if (isConflict) {
        notify.info("Friend request is already pending");
        queryClient.setQueryData<WithFriendship<UserProfileWithFavorite> | undefined>(
          profileQueryKey,
          (oldData) =>
            oldData
              ? { ...oldData, friendshipStatus: RequestStatus.PENDING }
              : oldData
        );
      } else {
        const errorMessage = getErrorMessage(error, "Action failed");
        notify.error(errorMessage);
        await queryClient.invalidateQueries({ queryKey: profileQueryKey });
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  return {
    onAction,
    isActionLoading,
  };
};