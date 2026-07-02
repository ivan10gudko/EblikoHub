import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { Room, RoomCreateDto, UpdateRoomPayload } from "~/entities/room/model/room.types";
import { notify } from "~/shared/lib";
import { roomService } from "../api/roomService"; 

export const useRoomMutation = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: RoomCreateDto) => roomService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            notify.success("Room created successfully!");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Something went wrong";
            notify.error(message);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateRoomPayload }) => 
            roomService.fullUpdate(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['room', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            notify.success("Room settings updated successfully!");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Method not allowed or server error";
            notify.error(message);
        }
    });

    return {
        createRoom: (
            data: RoomCreateDto,
            options?: Omit<UseMutationOptions<Room, Error, RoomCreateDto>, 'mutationFn'>
        ) => createMutation.mutate(data, options),
        isCreating: createMutation.isPending,

        updateRoom: (
            id: number,
            data: UpdateRoomPayload,
            options?: Omit<UseMutationOptions<Room, Error, { id: number; data: UpdateRoomPayload }>, 'mutationFn'>
        ) => updateMutation.mutate({ id, data }, options),
        isUpdating: updateMutation.isPending
    };
};