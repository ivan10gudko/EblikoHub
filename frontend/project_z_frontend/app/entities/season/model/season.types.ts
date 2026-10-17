
import type { Rating } from "~/shared/types/Rating";
import type { Status } from "~/shared/types/Status";

export enum SeasonType {
    TV = "TV",
    FILM = "FILM",
    OVA = "OVA",
    CHIBI = "CHIBI",
}

export interface Season {
    seasonId: number;
    name: string;
    rating?: Rating;
    status: Status;
    description?: string;
    apiTitleId?: number;
    type?: SeasonType;
    imageUrl?: string;
}


export const SEASON_TYPE_OPTIONS = [
    { value: SeasonType.TV, label: "TV" },
    { value: SeasonType.FILM, label: "FILM" },
    { value: SeasonType.OVA, label: "OVA" },
    { value: SeasonType.CHIBI, label: "CHIBI" },
];

export const SEASON_TYPE_LABELS: Record<SeasonType, string> = {
    [SeasonType.TV]: "TV",
    [SeasonType.FILM]: "Film",
    [SeasonType.OVA]: "OVA",
    [SeasonType.CHIBI]: "Chibi",
};

export const SeasonTypeOptionsColors: Record<SeasonType, string> = {
    [SeasonType.TV]: "text-foreground/90",
    [SeasonType.FILM]: "text-purple-500/90",
    [SeasonType.OVA]: "text-sky-500/90",
    [SeasonType.CHIBI]: "text-amber-800/90",
};

export const SeasonTypeThemes: Record<SeasonType, string> = {
    [SeasonType.TV]: "border-border hover:border-foreground/30",
    [SeasonType.FILM]: "bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40",
    [SeasonType.OVA]: "bg-sky-500/5 border-sky-500/20 hover:border-sky-500/40",
    [SeasonType.CHIBI]: "bg-orange-800/5 border-amber-800/20 hover:border-amber-800/40",
};
export interface CreateSeasonDto {
    name: string;
    status: Status;
    rating?: Rating;
    apiTitleId?: number;
    description?: string;
    type?: SeasonType;
    imageUrl?: string;
}

export type LocalDraftSeason = DraftSeason & { localId: string };

export interface UpdateSeasonDto extends Partial<Omit<CreateSeasonDto, 'seasonId'>> { }

export type DraftSeason = Omit<Season, 'seasonId'> & {
    seasonId: number | null;
};