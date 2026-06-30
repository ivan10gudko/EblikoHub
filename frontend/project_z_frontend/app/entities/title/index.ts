export {
    getTopAnimeList,
    getSeasonalAnimeList,
    getTopAnime,
    getAnimeById,
} from './api/jikan.api';

export type { AnimeCardType, Anime } from './model/animeTitle.types';

export { default as AnimeCard } from './ui/AnimeCard';
export { default as AnimeCardSceleton } from './ui/AnimeCardSkeleton';
export { default as AnimeStat } from './ui/AnimeStat';
export { default as Genres } from './ui/Genres';
export { default as Synopsis } from './ui/Synopsis';
export { default as Title } from './ui/Title';
export { default as Trailer } from './ui/Trailer';
export { searchOptions } from "./model/searchOptions"