import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { characterService } from "../api/characterService";
import { characterKeys } from "../model/character.queryKeys";
import type { CharacterParams } from "../model/character.types";

/** User's own characters, paged (backend pages start at 0) and filtered by name on the server. */
export const useMyCharacters = (params: Omit<CharacterParams, "page">, enabled = true) => {
    return useInfiniteQuery({
        queryKey: characterKeys.list(params),
        queryFn: ({ pageParam }) => characterService.search({ ...params, page: pageParam }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
        enabled,
        placeholderData: keepPreviousData,
        staleTime: 30 * 1000,
    });
};
