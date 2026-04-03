import type { QueryParams } from "~/shared/types";

//apiTitleId: 0 - no mal id
export enum Status{
    WATCHED = "WATCHED",
    PLANNED = "PLANNED",
    DROPPED = "DROPPED"
}

export interface TitleRating {
    overall: number;
    [key: string]: number;
}
export interface TitleRecord {
    titleId: number,
    apiTitleId: number,//0 - if no mal id
    titleName: string,
    rating?:TitleRating,
    status: Status,
    createdAt: string,
}
export interface TitleParams  extends QueryParams {
    status?: Status;
}

export interface CreateTitleRecord extends Omit<TitleRecord, 'titleId' | 'createdAt'> {}
