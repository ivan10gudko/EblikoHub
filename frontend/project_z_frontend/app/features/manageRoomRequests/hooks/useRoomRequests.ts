import { useMutation, useQueryClient, type InfiniteData, type QueryKey } from "@tanstack/react-query";
import type { RoomSearchResult } from "~/entities/room";
import { updateInfiniteQuery } from "~/shared/helpers/updateInfinityQuery";
import { notify } from "~/shared/lib";
import type { PageResponse } from "~/shared/types";
import { roomRequestsService } from "../api/roomRequestsService";


export const useRoomRequests = (roomId?: number) => {
  const queryClient = useQueryClient();
  const searchKey: QueryKey = ['room_search'];
  const roomListKey: QueryKey = ['rooms'];
  const requestsKey: QueryKey = ['room_requests'];

  type MutationContext = {
    previousData: InfiniteData<PageResponse<RoomSearchResult>> | undefined
  };

  const mutationConfig = {
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: roomListKey });
      queryClient.invalidateQueries({ queryKey: requestsKey });
    },
    onError: (err: any, _variables: any, context?: MutationContext) => {
      if (context?.previousData) {
        queryClient.setQueriesData({ queryKey: searchKey }, context.previousData);
      }
      notify.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const joinMutation = useMutation<void, Error, void, MutationContext>({
    ...mutationConfig,
    mutationFn: () => roomId ? roomRequestsService.joinRoom(roomId) : Promise.reject("Room ID required"),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: searchKey });
      const previousData = queryClient.getQueryData<InfiniteData<PageResponse<RoomSearchResult>>>(searchKey);

      if (roomId) {
        queryClient.setQueriesData<InfiniteData<PageResponse<RoomSearchResult>>>(
          { queryKey: searchKey },
          (oldData) => {
            if (!oldData) return undefined;
            return updateInfiniteQuery({
              oldData,
              getContent: (page) => page.content,
              setContent: (page, newContent) => ({ ...page, content: newContent }),
              updater: (content) => content.map(r =>
                r.roomId === roomId ? { ...r, isRequested: true } : r
              )
            });
          }
        );
      }
      return { previousData };
    },
    onSuccess: () => notify.success("Sent join request!")
  });

  const acceptMutation = useMutation({
    ...mutationConfig,
    mutationFn: ({ roomRequestId }: { roomRequestId: string }) =>
      roomRequestsService.acceptRequest(roomRequestId),
    onSuccess: () => notify.success("Request accepted!")
  });

  const rejectMutation = useMutation({
    ...mutationConfig,
    mutationFn: ({ roomRequestId }: { roomRequestId: string }) =>
      roomRequestsService.rejectRequest(roomRequestId),
    onSuccess: () => notify.success("Request rejected!")
  });

  const cancelMutation = useMutation({
    ...mutationConfig,
    mutationFn: ({ roomRequestId }: { roomRequestId: string }) =>
      roomRequestsService.cancelRequest(roomRequestId),
    onSuccess: () => {
      notify.success("Request cancelled!");
      if (roomId) {
        queryClient.invalidateQueries({ queryKey: ['room_users_search', roomId] });
      }
    }
  });

  const inviteMutation = useMutation({
    ...mutationConfig,
    mutationFn: ({ roomId, receiverId }: { roomId: number; receiverId: string }) =>
      roomRequestsService.inviteUser(roomId, receiverId),
    onSuccess: () => {
      notify.success("Invite sent successfully!");
      if (roomId) {
        queryClient.invalidateQueries({ queryKey: ['room_users_search', roomId] });
      }
    },
  });

  return {
    joinRoom: joinMutation.mutate,
    isJoining: joinMutation.isPending,
    cancelRequest: cancelMutation.mutate,
    acceptRequest: acceptMutation.mutate,
    rejectRequest: rejectMutation.mutate,
    sendInvite: inviteMutation.mutate,
    isSendingInvite: inviteMutation.isPending,
    isPendingAction: acceptMutation.isPending || rejectMutation.isPending
  };
};