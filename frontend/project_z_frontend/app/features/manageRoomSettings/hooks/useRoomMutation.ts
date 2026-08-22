import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { roomService } from "~/entities/room/api/roomService";
import { roomKeys } from "~/entities/room/model/room.keys";
import type { Room, RoomCreateDto, UpdateRoomPayload } from "~/entities/room/model/room.types";
import { notify } from "~/shared/lib";

interface ApiErrorResponse {
  message?: string;
}

export const useRoomMutation = () => {
  const queryClient = useQueryClient();

  const createRoom = useMutation<Room, AxiosError<ApiErrorResponse>, RoomCreateDto>({
    mutationFn: (data) => roomService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.all });
      notify.success("Room created successfully!");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Something went wrong";
      notify.error(message);
    },
  });

  const updateRoom = useMutation<
    Room, 
    AxiosError<ApiErrorResponse>, 
    { id: number; data: UpdateRoomPayload }
  >({
    mutationFn: ({ id, data }) => roomService.partialUpdate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roomKeys.details(variables.id) });
      queryClient.invalidateQueries({ queryKey: roomKeys.all });
      notify.success("Room settings updated successfully!");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Method not allowed or server error";
      notify.error(message);
    },
  });

  return {
    createRoom,
    updateRoom,
  };
};