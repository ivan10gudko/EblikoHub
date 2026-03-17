import type { PaginationMeta } from "~/shared/types/api";

export interface SearchResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}
