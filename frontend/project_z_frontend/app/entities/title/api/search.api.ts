
import type { AnimeCardType } from "../model/animeTitle.types";
import { publicClient } from "~/shared/api";
import { mapExternalProviderToAnimeCard } from "./mappers";
import type { SearchResponse } from "~/shared/types/api";

export async function getAnimeSearch(q: string, page: number = 1): Promise<SearchResponse<AnimeCardType>> {
    try {
        const options = {
            method: 'GET',
            url: `/search`,
            params: {
                q: q,
                page: page,
            }
        };

        //request to proxy with translations, NOT direct to externalProvider
        const response = await publicClient.request(options);

        const data = response.data.data;

        const animeList: AnimeCardType[] = data.map(mapExternalProviderToAnimeCard);

        return { data: animeList, pagination: response.data.pagination }

    } catch (error) {
        console.error(error);

        return EMPTY_PAGE;
    }
};

const EMPTY_PAGE: SearchResponse<AnimeCardType> = {
    data: [],
    pagination: {
        last_visible_page: 0,
        has_next_page: false,
        current_page: 0,
        items: {
            count: 0,
            total: 0,
            per_page: 0
        }
    }
};