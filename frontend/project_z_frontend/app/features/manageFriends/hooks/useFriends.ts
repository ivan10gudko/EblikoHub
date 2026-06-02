import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notify } from "~/shared/lib";
import { friendshipService } from "~/entities/friendship/api/friendshipService";


const getErrorMessage = (error: any, defaultMessage: string): string => {
    return error?.response?.data?.message || error?.message || defaultMessage;
};

export const useFriends = (userId: string, activeTab: string) => {
    const queryClient = useQueryClient();

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
        mutationFn: (receiverId: string) => friendshipService.sendFriendRequest(receiverId),
        onSuccess: () => { invalidateAll(); notify.success("Friend request sent!"); },
        onError: (error) => notify.error(getErrorMessage(error, "Failed to send friend request"))
    });

    const acceptRequestMutation = useMutation({
        mutationFn: (senderId: string) => friendshipService.acceptFriendRequest(senderId),
        onSuccess: () => { invalidateAll(); notify.success("Friend request accepted"); },
        onError: (error) => notify.error(getErrorMessage(error, "Failed to accept friend request"))
    });

    const rejectRequestMutation = useMutation({
        mutationFn: (senderId: string) => friendshipService.rejectFriendRequest(senderId),
        onSuccess: () => { invalidateAll(); notify.success("Friend request rejected"); },
        onError: (error) => notify.error(getErrorMessage(error, "Failed to reject friend request"))
    });

    const deleteFriendshipMutation = useMutation({
        mutationFn: (friendshipId: string) => friendshipService.deleteFriendshipById(friendshipId),
        onSuccess: () => { invalidateAll(); notify.success("Action processed successfully"); },
        onError: (error) => notify.error(getErrorMessage(error, "Failed to delete friendship connection"))
    });

    const isPendingGlobal =
        sendRequestMutation.isPending ||
        acceptRequestMutation.isPending ||
        rejectRequestMutation.isPending ||
        deleteFriendshipMutation.isPending;

    const handleFriendAction = (actionType: "delete" | "accept" | "reject" | "send", id: string) => {
        if (actionType === "delete") deleteFriendshipMutation.mutate(id);
        if (actionType === "accept") acceptRequestMutation.mutate(id);
        if (actionType === "reject") rejectRequestMutation.mutate(id);
        if (actionType === "send") sendRequestMutation.mutate(id);
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