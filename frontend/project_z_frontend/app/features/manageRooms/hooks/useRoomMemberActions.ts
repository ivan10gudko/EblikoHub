import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RoomMemberRoleUpdateDto, Room, RoomMemberShort } from "~/entities/room";
import { roomMemberService } from "../api/roomMemberService";
import { notify } from "~/shared/lib";

export const useRoomMemberActions = (roomId: number) => {
    const queryClient = useQueryClient();

    const memberListKey = ['rooms', roomId, 'members'];
    const roomDetailsKey = ["room", roomId];

    const updateRoleMutation = useMutation({
        mutationFn: (data: RoomMemberRoleUpdateDto) => roomMemberService.updateMemberRole(roomId, data),
        
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: memberListKey });
            await queryClient.cancelQueries({ queryKey: roomDetailsKey });

            const previousMembers = queryClient.getQueryData<RoomMemberShort[]>(memberListKey);
            const previousRoom = queryClient.getQueryData<Room>(roomDetailsKey);

            queryClient.setQueryData<RoomMemberShort[]>(memberListKey, (oldMembers) => {
                if (!oldMembers) return [];
                return oldMembers.map((member) => {
                    const memberId = member.user?.userId || member.id;
                    if (String(memberId) === String(variables.roomMemberId)) {
                        return { ...member, role: variables.role };
                    }
                    return member;
                });
            });

            queryClient.setQueryData<Room>(roomDetailsKey, (oldRoom) => {
                if (!oldRoom || !oldRoom.members) return oldRoom;
                return {
                    ...oldRoom,
                    members: oldRoom.members.map((member) => {
                        const memberId = member.user?.userId || member.id;
                        if (String(memberId) === String(variables.roomMemberId)) {
                            return { ...member, role: variables.role };
                        }
                        return member;
                    }),
                };
            });

            return { previousMembers, previousRoom };
        },

        onError: (error: Error, _variables, context) => {
            if (context?.previousMembers) {
                queryClient.setQueryData(memberListKey, context.previousMembers);
            }
            if (context?.previousRoom) {
                queryClient.setQueryData(roomDetailsKey, context.previousRoom);
            }
            notify.error("Failed to update room member role");
            console.error("Failed to update member role:", error.message);
        },

        onSuccess: () => {
            notify.success("Member role successfully updated");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: memberListKey });
            queryClient.invalidateQueries({ queryKey: roomDetailsKey });
        }
    });

    return {
        updateMemberRole: updateRoleMutation.mutateAsync,
        isUpdatingRole: updateRoleMutation.isPending,
    };
};