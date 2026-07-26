import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { useState } from "react";
import type { UserDtoWithFriendshipStatus } from "~/entities/friendship";
import { userService } from "~/entities/user";
import { useFriends } from "~/features/manageFriends/hooks/useFriends";
import { notify } from "~/shared/lib";
import { RequestStatus } from "~/shared/types";
import type { FriendActionType } from "~/features/manageFriends/types/friends.types";

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
    queryClient.setQueryData<UserDtoWithFriendshipStatus | undefined>(
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

        const updatedUser = await userService.getUserWithFriendshipStatus(userId);
        if (updatedUser) {
          queryClient.setQueryData(profileQueryKey, updatedUser);
        }
      } else {
        await handleFriendAction(action, targetId);
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number }; status?: number };
      const status = err?.response?.status || err?.status;

      if (status === 409) {
        notify.info("Friend request is already pending");
        queryClient.setQueryData<UserDtoWithFriendshipStatus | undefined>(
          profileQueryKey,
          (oldData) =>
            oldData
              ? { ...oldData, friendshipStatus: RequestStatus.PENDING }
              : oldData
        );
      } else {
        notify.error("Action failed");
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