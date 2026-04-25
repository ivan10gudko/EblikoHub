import type { QueryParams } from "~/shared/types";


export enum Status {
    WATCHED = "WATCHED",
    PLANNED = "PLANNED",
    DROPPED = "DROPPED",
    INPROGRESS = "INPROGRESS",
    DEFAULT = "DEFAULT"
}
export const statusOptions = [
    { value: Status.PLANNED, label: "Plan to Watch" },
    { value: Status.WATCHED, label: "Watched" },
    { value: Status.DROPPED, label: "Dropped" },
    { value: Status.INPROGRESS, label: "In Progress" },
    { value: Status.DEFAULT, label: "No Status" },
];
export type TitleRating =
    | { overall: number;[key: string]: number }
    | Record<string, never>;
    
export interface TitleRecord {
    titleId: number,
    apiTitleId?: number,
    titleName: string,
    rating?: TitleRating,
    status: Status,
    imageUrl?: string | null,
    customOrder: number,
    createdAt: string,
}

export interface TitleParams extends QueryParams {
    status?: Status;
    search?: string;
}

export interface CreateTitleRecord extends Omit<TitleRecord, 'titleId' | 'createdAt' | 'customOrder'> { }
