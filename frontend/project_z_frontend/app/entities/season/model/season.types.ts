
import type { Rating } from "~/shared/types/Rating";
import type { Status } from "~/shared/types";


export interface Season {
    seasonId: number;
    name: string;
    rating?: Rating;
    status: Status;
}

export interface CreateSeasonDto {
    name: string;
    status: Status;
    rating?: Rating;
}

export type LocalDraftSeason = DraftSeason & { localId: string };

export type UpdateSeasonDto = Partial<Omit<CreateSeasonDto, 'seasonId'>>;

export type DraftSeason = Omit<Season, 'seasonId'> & {
    seasonId: number | null;
};