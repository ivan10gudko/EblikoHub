import { queryOptions } from "@tanstack/react-query";
import { getAnimeSearch } from "../api/search.api";


export const searchOptions = (query: string, page: number = 1) => queryOptions({
    queryKey: ['search', query, page],
    queryFn: () => getAnimeSearch(query, page),
    enabled: !!query,
});