import axios from 'axios';
import type { AnimeCardType } from '~/components/Card/AnimeCard';

export const jikanApi = axios.create({
    baseURL: 'https://api.jikan.moe/v4',
});

export async function getTopAnimeList(): Promise<AnimeCardType[]> {
    try {
        const response = await jikanApi.get("/top/anime");
        const data = response.data.data;

        const animeList: AnimeCardType[] = data.map((item: any) => ({
            id: item.mal_id,
            title: item.title,
            score: item.score,
            img: item.images?.jpg?.image_url || "",
            year: item.year,
            episodes: item.episodes,
            genres: item.genres,
            airing: item.airing,
        }));

        return animeList;
    } catch (error) {
        console.error("Error fetching top anime:", error);
        return [];
    }
}

export async function getSeasonalAnimeList(): Promise<AnimeCardType[]> {
    try {
        const response = await jikanApi.get("/seasons/now");
        const data = response.data.data;

        const animeList: AnimeCardType[] = data.map((item: any) => ({
            id: item.mal_id,
            title: item.title,
            score: item.score,
            img: item.images?.jpg?.image_url || "",
            year: item.year,
            episodes: item.episodes,
            genres: item.genres,
            airing: item.airing,
        }));

        return animeList;
    } catch (error) {
        console.error("Error fetching seasonal anime:", error);
        return [];
    }
}


export async function getTopAnime(){

    const options = {
        method: 'GET',
        url: '/top/anime',
    };

    try {
	    const response = await jikanApi.request(options);
	    return response.data.data[0];
    } catch (error) {
	    console.error(error);
    }
};

export async function getAnimeById(id:number){

    const options = {
        method: 'GET',
        url: `/anime/${id}`
    };

    try {
	    const response = await jikanApi.request(options);
	    return response.data.data;
    } catch (error) {
	    console.error(error);
    }
};

export async function getSeasonNow(){
    const options = {
        method: 'GET',
        url: `/seasons/now`
    };

    try {
	    const response = await jikanApi.request(options);
	    return response.data.data;
    } catch (error) {
	    console.error(error);
    }
}
export async function getRecentAnimeRecommendations(){
const options = {
    method: 'GET',
    url: '/recommendations/anime',

};

try {
	const response = await jikanApi.request(options);
    console.log(response.data.data);
	return response.data.data;
    
} catch (error) {
	console.error(error);
}
};
