import type { PaginationMeta } from "~/shared/types";


export interface SearchResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}
