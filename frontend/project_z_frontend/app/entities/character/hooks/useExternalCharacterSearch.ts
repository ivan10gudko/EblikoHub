import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { characterService } from "../api/characterService";
import { characterKeys } from "../model/character.queryKeys";

export const EXTERNAL_CHARACTER_MIN_QUERY = 3;

export const useExternalCharacterSearch = (query: string, page = 1, enabled = true) => {
    const trimmed = query.trim();

    return useQuery({
        queryKey: characterKeys.external(trimmed, page),
        queryFn: () => characterService.searchExternal(trimmed, page),
        enabled: enabled && trimmed.length >= EXTERNAL_CHARACTER_MIN_QUERY,
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000,
    });
};
