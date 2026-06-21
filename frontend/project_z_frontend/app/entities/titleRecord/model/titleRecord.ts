import type { QueryParams } from "~/shared/types";
import type { Rating } from "~/shared/types/Rating";
import type { Status } from "~/shared/types/Status";

export interface TitleRecord {
    titleId: number,
    apiTitleId?: number,
    titleName: string,
    rating?: Rating,
    status: Status,
    titleType: TitleType,
    imageUrl?: string | null,
    customOrder: number,
    pinned : boolean
    createdAt: string,
    avgRating?: number;
}
export enum TitleType {
    ANIME = "ANIME",
    HENTAI = "HENTAI",
    MANGA = "MANGA",
    MOVIE = "MOVIE",
    SERIES = "SERIES"
}

export const titleTypeOptions = [
    { value: TitleType.ANIME, label: "Anime" },
    { value: TitleType.MANGA, label: "Manga" },
    { value: TitleType.SERIES, label: "Series" },
    { value: TitleType.MOVIE, label: "Movie" },
    { value: TitleType.HENTAI, label: "Hentai" },
];
export const TitleTypeThemes: Record<TitleType, string> = {
    [TitleType.ANIME]: "border-border",
    [TitleType.MANGA]: "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40",
    [TitleType.SERIES]: "bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40",
    [TitleType.MOVIE]: "bg-orange-500/4 border-amber-500/20 hover:border-amber-500/40",
    [TitleType.HENTAI]: "bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40",
};

export interface TitleParams extends QueryParams {
    status?: Status;
    search?: string;
    types?: TitleType[];
}

export interface TitleShortDto {
    titleId: number;
    titleName: string;
    ratingValue: number;
}

export interface CreateTitleRecord extends Omit<TitleRecord, 'titleId' | 'createdAt' | 'customOrder'> { }

export interface ManageTitleRecordProps {
    initialData: CreateTitleRecord;
    titleRecord: TitleRecord | null;
}
export interface SameCriteriaRating{
    titles : Array<TitleShortDto>;
    avgRating : number;
}
export const TitleTypeOptionsColors: Record<TitleType, string> = {
    [TitleType.ANIME]: "text-foreground",
    [TitleType.MANGA]: "text-green-500",
    [TitleType.SERIES]: "text-blue-500",
    [TitleType.MOVIE]: "text-amber-500",
    [TitleType.HENTAI]: "text-red-500",
};