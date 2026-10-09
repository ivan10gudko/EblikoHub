
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
    apiTitleId?: number;
    description?: string;
    type?: SeasonType;
    imageUrl?: string;
}

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