import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomTitleService } from "~/features/manageRoomTitles/api/roomTitleService";
import { notify } from "~/shared/lib";
import type { RoomTitleCreateRequest } from "../model/roomTitle.types";
import { getErrorMessage } from "~/shared/utils";
import { roomTitleKeys } from "../model/roomTitle.queryKeys";

interface UseBatchCreateRoomTitlesProps {
    roomId: number;
    onSuccess?: () => void;
}

export const useBatchCreateRoomTitles = ({ roomId, onSuccess }: UseBatchCreateRoomTitlesProps) => {
    const queryClient = useQueryClient();

    const invalidateAll = () => {
        queryClient.invalidateQueries({ queryKey: roomTitleKeys.room(roomId) });
    };

    const onError = (error: unknown) => {
        notify.error(getErrorMessage(error, "Failed to batch create titles"));
    };

    const mutation = useMutation({
        mutationFn: (dtos: RoomTitleCreateRequest[]) => roomTitleService.batchCreateRoomTitles(roomId, dtos),
        onSuccess: () => {
            notify.success("Selected titles successfully added!");
            onSuccess?.();
        },
        onError,
        onSettled: invalidateAll,
    });

    return {
        batchCreateTitles: mutation.mutate,
        batchCreateTitlesAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
    };
};