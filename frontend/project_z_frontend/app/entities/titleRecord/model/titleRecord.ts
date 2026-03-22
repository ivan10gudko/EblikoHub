//apiTitleId: 0 - no mal id
export enum Status{
    WATCHED = "WATCHED",
    PLANNED = "PLANNED"
}
export interface TitleRecord {
    titleId: number,
    apiTitleId: number,//0 - if no mal id
    titleName: string,
    rating:Record<'string',number>,//{ "story": 8, "art": 9 }
    status: Status,
    createdAt: string,
}

export interface CreateTitleRecord extends Omit<TitleRecord, 'titleId' | 'createdAt'> {}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number; // current page
    last: boolean;
    first: boolean;
    empty: boolean;
}