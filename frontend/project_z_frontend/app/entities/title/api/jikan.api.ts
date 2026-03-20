import { jikanClient } from "~/shared/api";
import type { Anime, AnimeCardType } from "../model/animeTitle.types";
import { mapJikanToAnimeCard } from "./mappers";


export async function getTopAnimeList(): Promise<AnimeCardType[]> {
    const response = await jikanClient.get("/top/anime");

    return response.data.data.map(mapJikanToAnimeCard);
}

export async function getSeasonalAnimeList(): Promise<AnimeCardType[]> {
    const response = await jikanClient.get("/seasons/now");
    
    return response.data.data.map(mapJikanToAnimeCard);
}

export async function getTopAnime(){
    const response = await jikanClient.get('/top/anime');
    
    return response.data.data[0];
};

export async function getAnimeById(id:number){
    const response = await jikanClient.get(`/anime/${id}`);
	
    return response.data.data;
};

export async function getSeasonNow(){
    const response = await jikanClient.get(`/seasons/now`);
	
    return response.data.data;
}

export async function getRecentAnimeRecommendations(){
    const response = await jikanClient.get('/recommendations/anime');
	
    return response.data.data;
};
