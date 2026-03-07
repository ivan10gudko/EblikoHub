import type { AnimeCardType } from "~/components/Card/AnimeCard";
import type { SeacrchResponse } from "../types/MyAnimeList.types";
import axios from "axios";
import { publicClient } from "./publicClient";

export async function getAnimeSearch(q: string, page: number = 1): Promise<SeacrchResponse<AnimeCardType>> {
    try {
        const options = {
            method: 'GET',
            url: `/search`,
            params: {
                q: q,
                page: page,
            }
        };

        const response = await publicClient.request(options);

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

        return { data: animeList, pagination: response.data.pagination }
    } catch (error) {
        console.error(error);

        return {
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
    }
};
