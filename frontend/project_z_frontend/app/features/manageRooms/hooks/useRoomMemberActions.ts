import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RoomMemberRoleUpdateDto } from "~/entities/room";
import { roomMemberService } from "../api/roomMemberService";
import { notify } from "~/shared/lib";

export const useRoomMemberActions = (roomId: number) => {
    const queryClient = useQueryClient();

    // Ключ, який ти використовуєш для завантаження списку учасників цієї кімнати
    const memberListKey = ['rooms', roomId, 'members'];

    const updateRoleMutation = useMutation({
        mutationFn: (data: RoomMemberRoleUpdateDto) => roomMemberService.updateMemberRole(roomId, data),
        onSuccess: () => {
            // Оновлюємо список учасників в кеші
            queryClient.invalidateQueries({ queryKey: memberListKey });
        },
        onError: (error: Error) => {
            notify.error("failed to update room member role");
            console.error("Failed to update member role:", error.message);
        }
    });

    return {
        updateMemberRole: updateRoleMutation.mutateAsync,
        isUpdatingRole: updateRoleMutation.isPending,
    };
};