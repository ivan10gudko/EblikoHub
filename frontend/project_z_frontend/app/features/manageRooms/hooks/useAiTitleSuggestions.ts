import { useQuery } from "@tanstack/react-query";
import { apiClient } from "~/shared/api";
import type { SuggestedTitleLinkDto } from "../model/roomTitle.types";

export const useAiTitleSuggestions = (roomId: number) => {
    return useQuery<SuggestedTitleLinkDto[]>({
        queryKey: ["aiTitleSuggestions", roomId],
        queryFn: async () => {
            const res = await apiClient.get<SuggestedTitleLinkDto[]>(
                `/rooms/${roomId}/links/suggestions`
            );
            return res.data;
        },
        refetchOnWindowFocus: false,
        staleTime: 0,
    });
};