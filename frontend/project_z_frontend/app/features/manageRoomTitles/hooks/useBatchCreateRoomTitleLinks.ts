import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "~/shared/api";
import type { RoomTitleLinkBatchCreateDto } from "../model/roomTitle.types";

interface UseBatchCreateRoomTitleLinksParams {
    roomId: number;
    onSuccess?: () => void;
}

export const useBatchCreateRoomTitleLinks = ({ roomId, onSuccess }: UseBatchCreateRoomTitleLinksParams) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: RoomTitleLinkBatchCreateDto) => {
            await apiClient.post(`/rooms/${roomId}/links/batch`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userRoomTitleLinks", roomId] });
            queryClient.invalidateQueries({ queryKey: ["suggestedRoomTitleLinks", roomId] });
            queryClient.invalidateQueries({ queryKey: ["aiTitleSuggestions", roomId] });
            
            onSuccess?.();
        },
    });
};