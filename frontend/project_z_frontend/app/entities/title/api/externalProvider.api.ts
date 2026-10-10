import { externalProviderClient } from "~/shared/api";
import type { Anime, AnimeCardType } from "../model/animeTitle.types";
import { mapExternalProviderToAnimeCard } from "./mappers";


export async function getTopAnimeList(): Promise<AnimeCardType[]> {
    const response = await externalProviderClient.get("/top/anime");

    return response.data.data.map(mapExternalProviderToAnimeCard);
}

export async function getSeasonalAnimeList(): Promise<AnimeCardType[]> {
    const response = await externalProviderClient.get("/seasons/now");

    return response.data.data.map(mapExternalProviderToAnimeCard);
}

export async function getTopAnime() {
    const response = await externalProviderClient.get('/top/anime');

    return response.data.data[0];
};

export async function getAnimeById(id: number) {
    const response = await externalProviderClient.get(`/anime/${id}`);

    return response.data.data;
};

export async function getSeasonNow() {
    const response = await externalProviderClient.get(`/seasons/now`);

    return response.data.data;
}

export async function getRecentAnimeRecommendations() {
    const response = await externalProviderClient.get('/recommendations/anime');

    return response.data.data;
};
