import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { Room, RoomCreateDto } from "~/entities/room/model/room.types";
import { notify } from "~/shared/lib";
import { getErrorMessage } from "~/shared/utils";
import { roomService } from "../api/roomService"; 

export const useRoomMutation = () => {
    const queryClient = useQueryClient();
    const createMutation = useMutation({
        mutationFn: (data: RoomCreateDto) => roomService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            notify.success("Room created, invites was sent!");
        },
        onError: (error: unknown) => {
            notify.error(getErrorMessage(error, "Something went wrong"));
        }
    });

    return {
        createRoom: (
            data: RoomCreateDto,
            options?: Omit<UseMutationOptions<Room, Error, RoomCreateDto>, 'mutationFn'>
        ) => createMutation.mutate(data, options),
        isCreating: createMutation.isPending
    };
};