import type { Anime, AnimeCardType } from "../model/animeTitle.types";

export const mapJikanToAnimeCard = (anime: Anime): AnimeCardType => {
    return {
        id: anime.mal_id,
        title: anime.title,
        score: anime.score ?? 0,
        img: anime.images.jpg?.image_url ?? "",
        year: anime.year ?? 0,
        episodes: anime.episodes ?? 0,
        
        genres: anime.genres || [],
        airing: anime.airing ?? false,
    };
};