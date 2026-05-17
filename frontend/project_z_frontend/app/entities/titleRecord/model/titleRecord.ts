import type { QueryParams } from "~/shared/types";
import type { Rating } from "~/shared/types/Rating";
import type { Status } from "~/shared/types/Status";

export interface TitleRecord {
    titleId: number,
    apiTitleId?: number,
    titleName: string,
    rating?: Rating,
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

export interface ManageTitleRecordProps{
    initialData: CreateTitleRecord,
    titleRecord: TitleRecord | null,
}