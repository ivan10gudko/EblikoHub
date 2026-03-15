export interface Anime {
    mal_id: number;
    url: string;
    images: {
        jpg: ImageSet;
        webp?: ImageSet;
    };
    trailer: {
        youtube_id?: string | null;
        url?: string | null;
        embed_url?: string | null;
        images: {
            image_url?: string | null;
            small_image_url?: string | null;
            medium_image_url?: string | null;
            maximum_image_url?: string | null;
            };
        };
        approved: boolean;
        titles: Title[];
        title: string;
        title_english?: string | null;
        title_japanese?: string | null;
        type?: string | null;
        source?: string | null;
        episodes?: number | null;
        status?: string | null;
        airing?: boolean;
        duration?: string | null;
        rating?: string | null;
        score?: number | null;
        scored_by?: number | null;
        rank?: number | null;
        popularity?: number | null;
        members?: number | null;
        favorites?: number | null;
        synopsis?: string | null;
        year?: number | null;
        genres: Genre[];
        themes:Genre[];
        [index:string]:any;
}

export interface Genre {
    mal_id: number;
    type?: string;
    name: string;
    url?: string;
}

export interface Title {
    type: string;
    title: string;
}

export interface ImageSet {
    image_url?: string | null;
    small_image_url?: string | null;
    large_image_url?: string | null;
}


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

export interface SeacrchResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}
