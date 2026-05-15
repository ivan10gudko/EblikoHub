
import type { Rating } from "~/shared/types/Rating";
import type { Status } from "~/shared/types/Status";


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

export interface ManageTitleRecordProps{
    initialData: CreateSeasonDto,
    titleRecord: Season | null,
}
export interface UpdateSeasonDto extends Partial<Omit<CreateSeasonDto, 'seasonId'>> {}

export type DraftSeason = Omit<Season, 'seasonId'> & {
    seasonId: number | null;
};