
export interface PaginationMeta {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
        count: number;
        total: number;
        per_page: number;
    };
}
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

export type SortOrder = 'ask' | 'desk';

export interface QueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: SortOrder;
}