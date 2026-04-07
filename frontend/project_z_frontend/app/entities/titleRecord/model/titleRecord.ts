import type { QueryParams } from "~/shared/types";

//apiTitleId: 0 - no mal id
export enum Status {
    WATCHED = "WATCHED",
    PLANNED = "PLANNED",
    DROPPED = "DROPPED",
    INPROGRESS = "INPROGRESS",
    DEFAULT = "DEFAULT"
}

export type TitleRating =
    | { overall: number;[key: string]: number }
    | Record<string, never>;
    
export interface TitleRecord {
    titleId: number,
    apiTitleId?: number,
    titleName: string,
    rating?: TitleRating,
    status: Status,
    createdAt: string,
}

export interface TitleParams extends QueryParams {
    status?: Status;
    search?: string;
}

export interface CreateTitleRecord extends Omit<TitleRecord, 'titleId' | 'createdAt'> { }
