
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
  { label: "TV", value: SeasonType.TV },
  { label: "Film", value: SeasonType.FILM },
  { label: "OVA", value: SeasonType.OVA },
  { label: "Chibi", value: SeasonType.CHIBI },
];
export const SEASON_TYPE_LABELS: Record<SeasonType, string> = {
    [SeasonType.TV]: "TV",
    [SeasonType.FILM]: "Film",
    [SeasonType.OVA]: "OVA",
    [SeasonType.CHIBI]: "Chibi",
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