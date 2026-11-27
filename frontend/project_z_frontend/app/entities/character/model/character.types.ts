import type { QueryParams } from "~/shared/types";

/** Character from the user's personal catalog (backend `characters` table). */
export interface Character {
    id: string;
    /** Tenrai / MAL id. `null` means a custom character created by the user. */
    apiId?: number | null;
    name: string;
    imageUrl?: string | null;
    createdAt?: string;
}

export interface CreateCharacter {
    name: string;
    imageUrl?: string | null;
    apiId?: number | null;
}

export interface CharacterParams extends QueryParams {
    search?: string;
}

/** Character returned by the backend proxy to Tenrai API (`/search/characters`). */
export interface ExternalCharacter {
    malId: number;
    name: string;
    imageUrl?: string | null;
}

export interface ExternalCharacterPagination {
    current_page: number;
    has_next_page: boolean;
    last_visible_page: number;
}

export interface ExternalCharacterPage {
    data: ExternalCharacter[];
    pagination: ExternalCharacterPagination;
}

/** What the user picked in the character combobox. */
export type CharacterChoice =
    | { source: "own"; character: Character }
    | { source: "api"; character: ExternalCharacter }
    | { source: "custom"; character: CreateCharacter };
