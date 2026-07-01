import { useMutation, useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { notify } from "~/shared/lib";
import { friendshipService } from "~/entities/friendship";
import type { FriendActionType } from "../types/friends.types";
import { RequestStatus, type PageResponse } from "~/shared/types";
import { updateInfiniteQuery } from "~/shared/helpers/updateInfinityQuery";
import type { UserDtoWithFriendshipStatus } from "~/entities/friendship";

const getErrorMessage = (error: any, defaultMessage: string): string => {
    return error?.response?.data?.message || error?.message || defaultMessage;
};

export const useFriends = (userId: string, activeTab: string) => {
    const queryClient = useQueryClient();

    const updateSearchCache = (id: string, actionType: FriendActionType) => {
        queryClient.setQueriesData<InfiniteData<PageResponse<UserDtoWithFriendshipStatus>>>(
            { queryKey: ["user_friendship_search"], exact: false },
            (oldData) => {
                if (!oldData) return undefined;

                return updateInfiniteQuery<PageResponse<UserDtoWithFriendshipStatus>, UserDtoWithFriendshipStatus>({
                    oldData,
                    getContent: (page) => page.content,
                    setContent: (page, newContent) => ({ ...page, content: newContent }),
                    updater: (allItems) => allItems.map((user) =>
                        (user.userId === id || user.friendshipId === id)
                            ? {
                                ...user,
                                friendshipStatus: actionType === "send" ? RequestStatus.PENDING : RequestStatus.NONE,
                                friendshipId: actionType === "send" ? user.friendshipId : null
                            }
                            : user
                    )
                });
            }
        );
    };

    const getMutationOptions = (actionType: FriendActionType) => ({
        onMutate: async (id: string) => {
            updateSearchCache(id, actionType);

            return {};
        },
        onError: (err: any) => {
            queryClient.invalidateQueries({ queryKey: ["user_friendship_search"] });

            notify.error(getErrorMessage(err, "Action failed"));
        },
        onSettled: () => {
            invalidateAll();
        }
    });

    const { data: counts } = useQuery({
        queryKey: ["friendship_counts", userId],
        queryFn: () => friendshipService.getFriendshipCounts(userId),
        placeholderData: { friendsCount: 0, pendingCount: 0, sentCount: 0 }
    });

    const { data: friends, isLoading: isFriendsLoading } = useQuery({
        queryKey: ["user_friends", userId],
        queryFn: () => friendshipService.getFriendsByUserId(userId),
        enabled: activeTab === "friends"
    });

    const { data: receivedData } = useQuery({
        queryKey: ["user_pending_requests", userId],
        queryFn: () => friendshipService.getReceivedPendingRequests(userId),
        enabled: activeTab === "pending"
    });

    const { data: sentData } = useQuery({
        queryKey: ["user_sent_requests", userId],
        queryFn: () => friendshipService.getSentPendingRequests(userId),
        enabled: activeTab === "sent"
    });

    const pendingRequests = (receivedData || []).map(item => ({
        userId: item.user.userId,
        name: item.user.name,
        nameTag: item.user.nameTag,
        description: item.user.description,
        img: item.user.img,
        createdAt: item.user.createdAt,
        friendshipId: item.friendshipId
    }));

    const sentRequests = (sentData || []).map(item => ({
        userId: item.user.userId,
        name: item.user.name,
        nameTag: item.user.nameTag,
        description: item.user.description,
        img: item.user.img,
        createdAt: item.user.createdAt,
        friendshipId: item.friendshipId
    }));

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: ["friendship_counts", userId] });
        queryClient.invalidateQueries({ queryKey: ["user_friends", userId] });
        queryClient.invalidateQueries({ queryKey: ["user_pending_requests", userId] });
        queryClient.invalidateQueries({ queryKey: ["user_sent_requests", userId] });
    };

    const sendRequestMutation = useMutation({
        mutationFn: (id: string) => friendshipService.sendFriendRequest(id),
        ...getMutationOptions("send"),
        onSuccess: () => notify.success("Friend request sent!")
    });

    const acceptRequestMutation = useMutation({
        mutationFn: (id: string) => friendshipService.acceptFriendRequest(id),
        ...getMutationOptions("accept"),
        onSuccess: () => notify.success("Friend request accepted")
    });

    const rejectRequestMutation = useMutation({
        mutationFn: (id: string) => friendshipService.rejectFriendRequest(id),
        ...getMutationOptions("reject"),
        onSuccess: () => notify.success("Friend request rejected")
    });

    const deleteFriendshipMutation = useMutation({
        mutationFn: (id: string) => friendshipService.deleteFriendshipById(id),
        ...getMutationOptions("delete"),
        onSuccess: () => notify.success("Action processed successfully")
    });

    const isPendingGlobal =
        sendRequestMutation.isPending ||
        acceptRequestMutation.isPending ||
        rejectRequestMutation.isPending ||
        deleteFriendshipMutation.isPending;

    const handleFriendAction = (actionType: FriendActionType, id: string) => {
        const mutations = {
            delete: deleteFriendshipMutation,
            accept: acceptRequestMutation,
            reject: rejectRequestMutation,
            send: sendRequestMutation,
        };
        mutations[actionType]?.mutate(id);
    };

    return {
        counts: counts || { friendsCount: 0, pendingCount: 0, sentCount: 0 },
        friends,
        pendingRequests,
        sentRequests,
        isFriendsLoading,
        isPendingGlobal,
        handleFriendAction,

        sendFriendRequest: sendRequestMutation.mutate,
        isSending: sendRequestMutation.isPending,
        acceptFriendRequest: acceptRequestMutation.mutate,
        isAccepting: acceptRequestMutation.isPending,
        rejectFriendRequest: rejectRequestMutation.mutate,
        isRejecting: rejectRequestMutation.isPending,
        deleteFriendship: deleteFriendshipMutation.mutate,
        isDeleting: deleteFriendshipMutation.isPending
    };
};